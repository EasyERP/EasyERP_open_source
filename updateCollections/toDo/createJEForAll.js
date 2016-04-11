/**
 * Created by liliy on 01.04.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var journalEntrySchema = mongoose.Schemas.journalEntry;
var MonthHoursSchema = mongoose.Schemas.MonthHours;
var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;
var invoiceSchema = mongoose.Schemas.Invoice;
var holidaysSchema = mongoose.Schemas.Holiday;
var vacationSchema = mongoose.Schemas.Vacation;
var journalSchema = mongoose.Schemas.journal;
var notDevArray = CONSTANTS.NOT_DEV_ARRAY;

var HOURSCONSTANT = 8;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Model = dbObject.model('journalEntry', journalEntrySchema);
    var monthHoursModel = dbObject.model('MonthHours', MonthHoursSchema);
    var WTrack = dbObject.model('wTrack', wTrackSchema);
    var Employee = dbObject.model('Employees', employeeSchema);
    var Invoice = dbObject.model('Invoice', invoiceSchema);
    var Holidays = dbObject.model('Holiday', holidaysSchema);
    var Vacation = dbObject.model('Vacation', vacationSchema);
    var reconcileSalaryEntries;
    var reconcileInvoiceEntries;
    var parallelTasks;

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal = dbObject.model('journal', journalSchema);
        var Model = dbObject.model('journalEntry', journalEntrySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;

        var waterfallTasks = [journalFinder, journalEntrySave];

        function journalFinder(waterfallCb) {
            var err;

            if (!journalId) {
                err = new Error('Journal id is required field');
                err.status = 400;

                return waterfallCb(err);
            }

            Journal.findById(journalId, waterfallCb);
        }

        function journalEntrySave(journal, waterfallCb) {
            var err;
            var debitObject;
            var creditObject;
            var parallelTasks = {
                debitSaver : function (parallelCb) {
                    var journalEntry;

                    debitObject.debit = amount;
                    debitObject.account = journal.debitAccount;

                    debitObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    debitObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    if (amount && moment(debitObject.date).isBefore(now)) {
                        journalEntry = new Model(debitObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }

                },
                creditSaver: function (parallelCb) {
                    var journalEntry;

                    creditObject.credit = amount;
                    creditObject.account = journal.creditAccount;

                    creditObject.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    creditObject.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    if (amount && moment(debitObject.date).isBefore(now)) {
                        journalEntry = new Model(creditObject);
                        journalEntry.save(parallelCb);
                    } else {
                        parallelCb();
                    }
                }
            };

            if (!journal || !journal._id) {
                err = new Error('Invalid Journal');
                err.status = 400;

                return waterfallCb(err);
            }

            currency = {
                name: 'USD',
                rate: 1
            };

            body.currency = currency;
            body.journal = journal._id;

            debitObject = _.extend({}, body);
            creditObject = _.extend({}, body);

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, result);
            });
        }

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    }

    /*reconcileInvoiceEntries = function (mainCallback) {
     Invoice.find({reconcile: true}, function (err, result) {
     if (err) {
     return mainCallback(err);
     }

     var resultArray = [];

     result.forEach(function (el) {
     resultArray.push(el._id);
     });

     var parallelRemove = function (cb) {
     Model.remove({
     "sourceDocument._id": {$in: resultArray}
     }, function (err, result) {
     if (err) {
     return cb(err);
     }

     cb();
     });
     };
     var parallelCreate = function (cb) {
     async.each(resultArray, function (element, asyncCb) {
     Invoice.findById(element, function (err, invoice) {
     if (err) {
     return asyncCb(err);
     }

     var journalEntryBody = {};

     journalEntryBody.date = invoice.invoiceDate;
     journalEntryBody.journal = invoice.journal || CONSTANTS.INVOICE_JOURNAL;
     journalEntryBody.currency = invoice.currency ? invoice.currency._id : 'USD';
     journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
     journalEntryBody.sourceDocument = {};
     journalEntryBody.sourceDocument._id = invoice._id;
     journalEntryBody.sourceDocument.model = 'Invoice';

     createReconciled(journalEntryBody, "production", asyncCb, "52203e707d4dba8813000003");
     });
     }, function () {
     cb();
     });

     };

     var parallelTasks = [parallelRemove, parallelCreate];

     async.parallel(parallelTasks, function (err) {
     if (err) {
     return mainCallback(err);
     }

     Invoice.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function () {
     mainCallback();
     });
     });
     });
     };*/

    var weeksArray = [1/*, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,*//*21,22,23,24,25,26,27,28,29,30,*//*31, 32, 33,34,35,36,37,38,39,40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52*/];

    weeksArray.forEach(function (week) {
        console.log('start week ', week);
        reconcileSalaryEntries = function (mainCallback) {
            var salaryObject = {};
            var monthHoursObject = {};
            var holidaysObject = {};
            var vacationObject = {};

            var timeToSet = {hour: 18, minute: 1, second: 0};
            var createdDateObject = {};
            var createDirect;
            var waterfallForSalary;
            var wTrackFinder;
            var parallelFunctionRemoveCreate;
            var removeBySource;
            var create;
            var createIdle;
            var parallelRemoveCreate;
            var waterfallCreateEntries;
            var wTracks;

            wTrackFinder = function (wfcallback) {
                WTrack.find({year: 2014, week: week, month: 12}, function (err, result) {
                    if (err) {
                        return wfcallback(err);
                    }
                    var resultArray = [];
                    var employeesObj = {};
                    var monthKeysObj = {};
                    var weekKeysObj = {};
                    var employees;
                    var monthKeys;
                    var weekKeys;

                    result.forEach(function (el) {
                        resultArray.push(el._id);
                        employeesObj[el.employee] = true;
                        monthKeysObj[el.dateByMonth] = true;
                        weekKeysObj[el.dateByWeek] = true;
                    });

                    wTracks = resultArray;

                    employees = Object.keys(employeesObj);
                    monthKeys = Object.keys(monthKeysObj);
                    weekKeys = Object.keys(weekKeysObj);

                    wfcallback(null, {
                        wTrackIds   : resultArray,
                        wTracks     : result,
                        employeesIds: employees,
                        monthKeys   : monthKeys,
                        weekKeys    : weekKeys
                    });
                });
            };

            parallelFunctionRemoveCreate = function (wTrackResultObject, wfcallback) {
                var wTrackIds = wTrackResultObject.wTrackIds;
                var wTracks = wTrackResultObject.wTracks;
                var employeesArray = wTrackResultObject.employeesIds;
                var dateByMonthArray = wTrackResultObject.monthKeys;

                if (!wTrackIds.length) {
                    return wfcallback();
                }

                removeBySource = function (pbc) {
                    Model.remove({
                        "sourceDocument._id": {$in: wTrackIds}
                    }, pbc);
                };

                create = function (pcb) {

                    createDirect = function (createWaterfallCb) {
                        var salaryFinder = function (parallelCb) {
                            var query = Employee.find({_id: {$in: employeesArray}}, {transfer: 1}).lean();

                            query.exec(function (err, employees) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                employees.forEach(function (employee) {
                                    var transferArray = employee.transfer;
                                    if (!salaryObject[employee._id]) {
                                        salaryObject[employee._id] = {};
                                    }

                                    transferArray.forEach(function (transferObj) {
                                        salaryObject[employee._id][transferObj.date] = transferObj.salary || 0;
                                    });
                                });

                                parallelCb(null, salaryObject);
                            });
                        };

                        var monthHoursFinder = function (parallelCb) {
                            async.each(dateByMonthArray, function (key, cb) {
                                var year = parseInt(key.slice(0, 4), 10);
                                var month = parseInt(key.slice(4, 6), 10);

                                monthHoursModel.find({month: month, year: year}, function (err, result) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    if (!monthHoursObject[key]) {
                                        monthHoursObject[key] = {};
                                    }

                                    monthHoursObject[key] = result && result[0] ? result[0] : {};
                                    cb();
                                });
                            }, function () {
                                parallelCb(null, monthHoursObject);
                            });
                        };

                        var holidaysFinder = function (parallelCb) {
                            var query = Holidays.find().lean();

                            query.exec(function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                result.forEach(function (holiday) {
                                    var holidayDate = moment(holiday.date);
                                    var key = (holidayDate.year() * 100 + holidayDate.month() + 1) * 100 + holidayDate.date();
                                    holidaysObject[key] = true;
                                });

                                parallelCb(null, holidaysObject);
                            });
                        };

                        var vacationFinder = function (parallelCb) {
                            var query = Vacation.find().lean();

                            query.exec(function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                result.forEach(function (vacation) {
                                    if (!vacationObject[vacation.employee]) {
                                        vacationObject[vacation.employee] = {};
                                    }
                                    var newDate = moment(new Date()).year(vacation.year).month(vacation.month - 1).date(1);
                                    var vacArray = vacation.vacArray;
                                    var length = vacArray.length;
                                    var i;

                                    for (i = length - 1; i >= 0; i--) {
                                        if (vacArray[i]) {
                                            var key = (newDate.date(i + 1).year() * 100 + newDate.date(i + 1).month() + 1) * 100 + i + 1;
                                            vacationObject[vacation.employee][key] = vacArray[i];
                                        }
                                    }

                                });

                                parallelCb(null, vacationObject);
                            });
                        };

                        async.parallel([salaryFinder, monthHoursFinder, holidaysFinder, vacationFinder], function (err, result) {
                            async.each(wTracks, function (wTrackModel, asyncCb) {
                                var j;
                                var dataObject = {};
                                var keys;
                                var employeeSubject = wTrackModel.employee;
                                var sourceDocumentId = wTrackModel._id;
                                var methodCb;
                                var date = moment().year(wTrackModel.year).month(wTrackModel.month - 1).isoWeek(wTrackModel.week).startOf('isoWeek');

                                for (j = 5; j >= 1; j--) {
                                    date = moment(date).day(j);
                                    dataObject[j] = date;
                                }

                                date = moment(date).day(6);
                                dataObject[6] = date;

                                date = moment(date).day(0);
                                dataObject[7] = date;

                                keys = Object.keys(dataObject);
                                methodCb = _.after(keys.length * 4, asyncCb);

                                keys.forEach(function (i) {
                                    var hours = wTrackModel[i];
                                    var date = dataObject[i];
                                    var day = i;
                                    var dateByMonth = wTrackModel.dateByMonth;
                                    var monthHours = monthHoursObject[dateByMonth];
                                    var overheadRate = monthHours ? monthHours.overheadRate : 0;
                                    var employeeSalary = salaryObject[employeeSubject];
                                    var salary = 0;
                                    var salaryChangeDates = Object.keys(employeeSalary);
                                    var costHour;
                                    var hoursInMonth = monthHours ? monthHours.hours : 0;
                                    var dateKey = (date.year() * 100 + date.month() + 1) * 100 + date.date();
                                    var holidayDate = holidaysObject[dateKey];
                                    var sameDayHoliday = holidayDate;
                                    var vacationForEmployee = vacationObject[employeeSubject] || {};
                                    var vacationSameDate = vacationForEmployee[dateKey];

                                    var overtime = (wTrackModel._type === 'overtime') || false;

                                    Model.remove({
                                        "sourceDocument.model": 'Employees',
                                        date                  : date.set(timeToSet)
                                    }, function (err, result) {

                                        for (var i = salaryChangeDates.length - 1; i >= 0; i--) {
                                            var currentSalary = employeeSalary[salaryChangeDates[i]];
                                            var salaryDate = moment(new Date(salaryChangeDates[i]));

                                            if (salaryDate.isBefore(date)) {
                                                salary = currentSalary;
                                                break;
                                            }
                                        }

                                        costHour = isFinite(salary / hoursInMonth) ? salary / hoursInMonth : 0;

                                        if (!createdDateObject[dateKey]) {
                                            createdDateObject[dateKey] = {};
                                            createdDateObject[dateKey].employees = {};
                                        }

                                        if (!createdDateObject[dateKey].employees[employeeSubject]) {
                                            createdDateObject[dateKey].employees[employeeSubject] = {
                                                vacation: 0,
                                                hours   : 0,
                                                wTracks : {}
                                            }
                                        }

                                        var bodySalary = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.SALARY_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id  : sourceDocumentId
                                            }
                                        };

                                        var bodyVacation = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.VACATION_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'Employees',
                                                _id  : employeeSubject
                                            }
                                        };

                                        var bodyOvertime = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.OVERTIME_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id  : sourceDocumentId
                                            }
                                        };

                                        var bodyOverhead = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.OVERHEAD,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id  : sourceDocumentId
                                            }
                                        };

                                        if (day <= 5 && !sameDayHoliday) {
                                            if (hours - HOURSCONSTANT >= 0) {
                                                bodySalary.amount = costHour * HOURSCONSTANT * 100;
                                                bodyOvertime.amount = costHour * (hours - HOURSCONSTANT) * 100;
                                                bodyOverhead.amount = overheadRate * HOURSCONSTANT * 100;
                                            } else {
                                                bodySalary.amount = costHour * hours * 100;
                                                bodyOvertime.amount = 0;
                                                bodyOverhead.amount = overheadRate * hours * 100;
                                            }

                                            if (vacationSameDate) {
                                                if ((vacationForEmployee[dateKey] === "V") || (vacationForEmployee[dateKey] === "S")) {
                                                    bodyOvertime.amount = costHour * hours * 100;
                                                    bodyOverhead.amount = overheadRate * hours * 100;
                                                    bodySalary.amount = 0;

                                                    if (!createdDateObject[dateKey].employees[employeeSubject].vacation) {
                                                        createdDateObject[dateKey].employees[employeeSubject].vacation = HOURSCONSTANT;
                                                        bodyVacation.amount = costHour * HOURSCONSTANT * 100;
                                                    }
                                                }
                                            }

                                            if (!createdDateObject[dateKey].employees[employeeSubject].wTracks[sourceDocumentId]) {
                                                createdDateObject[dateKey].employees[employeeSubject].wTracks[sourceDocumentId] = 0;
                                            }

                                            createdDateObject[dateKey].employees[employeeSubject].costHour = costHour;
                                            createdDateObject[dateKey].employees[employeeSubject].hours += hours;
                                            createdDateObject[dateKey].employees[employeeSubject].wTracks[sourceDocumentId] += hours;
                                        } else {
                                            bodyOvertime.amount = costHour * hours * 100;
                                            bodyOverhead.amount = overheadRate * hours * 100;

                                            if (sameDayHoliday) {
                                                bodyOvertime.amount = costHour * hours * 100;
                                                bodyVacation.amount = 0;
                                            }
                                        }

                                        //if (overtime) {
                                        //    bodyOvertime.amount = costHour * hours * 100;
                                        //    bodyOverhead.amount = overheadRate * hours * 100;
                                        //}

                                        createReconciled(bodySalary, 'production', methodCb, '52203e707d4dba8813000003');
                                        createReconciled(bodyOvertime, "production", methodCb, "52203e707d4dba8813000003");
                                        createReconciled(bodyOverhead, "production", methodCb, "52203e707d4dba8813000003");
                                        createReconciled(bodyVacation, "production", methodCb, "52203e707d4dba8813000003");

                                    });

                                });
                            }, function () {
                                createWaterfallCb(null, createdDateObject);
                            });
                        });
                    };

                    createIdle = function (totalObject, createWaterfallCb) {
                        var dates = Object.keys(totalObject);
                        var totalIdleObject = {};
                        var findAllDevs;
                        var createIdleTime;
                        var matchObj;
                        var findMonthHours;
                        var monthHours = {};

                        if (!dates.length) {
                            return createWaterfallCb();
                        }

                        var minDate = _.min(dates);
                        var maxDate = _.max(dates);
                        var startYear = parseInt(minDate.slice(0, 4), 10);
                        var startMonth = parseInt(minDate.slice(4, 6), 10);
                        var dateOfMonth = parseInt(minDate.slice(6), 10);
                        var date = moment().year(startYear).month(startMonth - 1).date(dateOfMonth);
                        var endYear = parseInt(maxDate.slice(0, 4), 10);
                        var endMonth = parseInt(maxDate.slice(4, 6), 10);
                        var endDateOfMonth = parseInt(maxDate.slice(6), 10);
                        var endDate = moment().year(endYear).month(endMonth - 1).date(endDateOfMonth);
                        var j;

                        var startDateKey = startYear * 100 + moment(date).isoWeek();
                        var endDateKey = endYear * 100 + moment(endDate).isoWeek();

                        //var startOfMonth = moment(date).startOf('month');
                        //var startK = (moment(startOfMonth).isoWeekYear() * 100 + moment(startOfMonth).month() + 1) * 100 + moment(startOfMonth).date();
                        //var endOfMonth = moment(endDate).endOf('month');
                        //var endK = (moment(endOfMonth).isoWeekYear() * 100 + moment(endOfMonth).month() + 1) * 100 + moment(endOfMonth).date();
                        //var length = endK - startK;
                        //
                        //for (j = length - 1; j >= 0; j--){
                        //    newDateArrayWithIdle.push((startK + j).toString());
                        //}

                        matchObj = {
                            $and: [{
                                $or: [{
                                    $and: [{
                                        isEmployee: true
                                    }, {
                                        $or: [{
                                            lastFire: null
                                        }, {
                                            lastFire: {
                                                $ne : null,
                                                $gte: startDateKey
                                            }
                                        }, {
                                            lastHire: {
                                                $ne : null,
                                                $lte: endDateKey
                                            }
                                        }]
                                    }]
                                }, {
                                    $and: [{
                                        isEmployee: false
                                    }, {
                                        lastFire: {
                                            $ne : null,
                                            $gte: startDateKey
                                        }
                                    }]
                                }
                                ]
                            }]
                        };

                        findAllDevs = function (callback) {
                            Employee
                                .aggregate([{
                                    $match: {
                                        //  'department': {$nin: notDevArray.objectID()},
                                        hire: {$ne: []}
                                    }
                                }, {
                                    $project: {
                                        isEmployee: 1,
                                        hire      : 1,
                                        transfer  : 1,
                                        name      : 1,
                                        lastFire  : 1,
                                        lastHire  : {
                                            $let: {
                                                vars: {
                                                    lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                                                },
                                                in  : {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                                            }
                                        }
                                    }
                                }, /* {
                                 $match: matchObj
                                 },*/ {
                                    $project: {
                                        _id     : 1,
                                        hire    : 1,
                                        transfer: 1
                                    }
                                }], function (err, result) {
                                    if (err) {
                                        callback(err);
                                    }

                                    var emps = _.pluck(result, '_id');

                                    callback(null, {emps: emps, salary: result});
                                });
                        };

                        findMonthHours = function (empResult, callback) {
                            async.each(dates, function (dateKey, asyncCb) {
                                var year = parseInt(dateKey.slice(0, 4), 10);
                                var month = parseInt(dateKey.slice(4, 6), 10);
                                var key = year * 100 + month;

                                if (!monthHoursObject[key]) {

                                    monthHoursModel.find({month: month, year: year}, function (err, result) {
                                        if (err) {
                                            return asyncCb(err);
                                        }

                                        if (!monthHoursObject[key]) {
                                            monthHoursObject[key] = {};
                                        }

                                        monthHoursObject[key] = result && result[0] ? result[0] : {};
                                        asyncCb();
                                    })
                                } else {
                                    asyncCb();
                                }

                            }, function (err, result) {
                                callback(null, {
                                    monthHours: monthHoursObject,
                                    emps      : empResult.emps,
                                    salary    : empResult.salary
                                });
                            });
                        };

                        createIdleTime = function (empResult, callback) {
                            var newDates = _.uniq(dates);
                            async.each(newDates, function (dateKey, asyncCb) {
                                var year = parseInt(dateKey.slice(0, 4), 10);
                                var month = parseInt(dateKey.slice(4, 6), 10);
                                var dateOfMonth = parseInt(dateKey.slice(6), 10);
                                var date = moment().year(year).month(month - 1).date(dateOfMonth);
                                var objectForDay = totalObject[dateKey] || {};
                                var employeesObjects = objectForDay.employees || [];
                                var employeesIds = Object.keys(employeesObjects);

                                var stringIds = [];

                                empResult.emps.forEach(function (el) {
                                    stringIds.push(el.toString());
                                });

                                var allEmployees = _.union(employeesIds, stringIds);
                                var employeesCount = allEmployees.length;
                                var i;
                                var employeesWithSalary = empResult.salary;
                                var monthHours = empResult.monthHours[year * 100 + month] || {};
                                var dayOfWeek = moment(date).day();
                                var cb = _.after(employeesCount, asyncCb);
                                var holidayDate = holidaysObject[dateKey];
                                var sameDayHoliday = holidayDate;

                                if ((dayOfWeek === 0) || (dayOfWeek === 6)) {
                                    return asyncCb();
                                }

                                if (!totalIdleObject[dateKey]) {
                                    totalIdleObject[dateKey] = 0;
                                }
                                Model.remove({
                                    "sourceDocument.model": 'Employees',
                                    date                  : date.set(timeToSet),
                                    journal               : CONSTANTS.IDLE_PAYABLE
                                }, function (err, result) {
                                    for (i = employeesCount - 1; i >= 0; i--) {
                                        var employee = allEmployees[i];
                                        var empObject = employeesObjects[employee] || {};
                                        var vacation = empObject.vacation;
                                        var totalWorkedForDay = empObject.hours || 0;
                                        var salary = 0;
                                        var employeeNotTracked = _.find(employeesWithSalary, function (elem) {
                                            return elem._id.toString() === employee.toString();
                                        });
                                        var hireArray = employeeNotTracked ? employeeNotTracked.transfer : [];
                                        var length = hireArray.length;
                                        var j;
                                        var costHour = 0;
                                        var hours = monthHours.hours || 0;
                                        var createVacation = false;
                                        var department;

                                        for (j = length - 1; j >= 0; j--) {
                                            if (date >= hireArray[j].date) {
                                                salary = hireArray[j].salary;
                                                department = hireArray[j].department;
                                                break;
                                            }
                                        }

                                        if (employee.toString() === '55b92ad221e4b7c40f00007f' && dateKey === '20150102') {
                                            console.log('ddd');

                                        }

                                        if (!vacation) {
                                            vacation = vacationObject[employee] ? vacationObject[employee][dateKey] : null;

                                            if ((vacation === 'P') || (vacation === 'E')) {
                                                vacation = null;
                                            }

                                            if (vacation) {
                                                createVacation = true;
                                            }
                                        }

                                        costHour = empObject.costHour || (isFinite(salary / hours) ? (salary / hours) : 0);

                                        var bodySalaryIdle = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.IDLE_PAYABLE,
                                            date          : date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'Employees'
                                            }
                                        };

                                        var idleTime = HOURSCONSTANT - totalWorkedForDay;

                                        bodySalaryIdle.sourceDocument._id = employee;

                                        if (totalWorkedForDay - HOURSCONSTANT < 0) {
                                            if (!vacation) {
                                                if (totalWorkedForDay - HOURSCONSTANT >= 0) {
                                                    bodySalaryIdle.amount = 0;
                                                } else {
                                                    bodySalaryIdle.amount = costHour * idleTime * 100;
                                                    totalIdleObject[dateKey] += costHour * idleTime * 100;
                                                }

                                            } else {
                                                bodySalaryIdle.amount = 0;
                                            }
                                        } else {
                                            bodySalaryIdle.amount = 0;
                                        }

                                        if (createVacation) {
                                            bodySalaryIdle.amount = costHour * HOURSCONSTANT * 100;
                                            bodySalaryIdle.journal = CONSTANTS.VACATION_PAYABLE;
                                        }

                                        if (department && notDevArray.indexOf(department.toString()) !== -1) {
                                            bodySalaryIdle.amount = 0;
                                            cb();
                                            continue;
                                        }

                                        if (sameDayHoliday) {
                                            bodySalaryIdle.amount = 0;
                                        }

                                        if ((bodySalaryIdle.amount > 0) && (bodySalaryIdle.journal === CONSTANTS.VACATION_PAYABLE)) {
                                            if (!employeesObjects[employee]) {
                                                employeesObjects[employee] = {};
                                            }

                                            employeesObjects[employee].vacation = 'V';
                                        }

                                        if (bodySalaryIdle.amount > 0) {
                                            createReconciled(bodySalaryIdle, "production", cb, "52203e707d4dba8813000003");
                                        } else {
                                            cb();
                                        }
                                    }
                                });
                            }, function (err, result) {
                                callback(err, {totalIdleObject: totalIdleObject, totalObject: totalObject});
                            });
                        };

                        var waterfall = [findAllDevs, findMonthHours, createIdleTime];

                        async.waterfall(waterfall, function (err, result) {
                            if (err) {
                                return createWaterfallCb(err);
                            }

                            createWaterfallCb(err, {totalIdleObject: totalIdleObject, totalObject: totalObject});
                        });

                    };

                    waterfallCreateEntries = [createDirect, createIdle];

                    async.waterfall(waterfallCreateEntries, function (err, result) {
                        if (err) {
                            return pcb(err);
                        }

                        pcb(null, result);
                    });
                };

                parallelRemoveCreate = [removeBySource, create];

                async.parallel(parallelRemoveCreate, function (err, result) {
                    if (err) {
                        return wfcallback(err);
                    }

                    wfcallback(null, result);
                });
            };

            waterfallForSalary = [wTrackFinder, parallelFunctionRemoveCreate];

            async.waterfall(waterfallForSalary, function (err, result) {
                if (err) {
                    return mainCallback(err);
                }

                mainCallback(null, result);
            });
        };

        parallelTasks = [/*reconcileInvoiceEntries, */reconcileSalaryEntries];

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return console.log(err);
            }

            console.log(week);
        });
    });

});