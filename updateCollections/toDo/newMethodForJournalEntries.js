/**
 * Created by roma on 27.04.16.
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
var ObjectId = mongoose.Types.ObjectId;

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
    var createdDateObject = {};
    var timeToSet = {hour: 15, minute: 1, second: 0};
    var totalIdleObject = {};
    var dateByMonthArray = [];

    var reconcileSalaryEntries;

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
                debitSaver: function (parallelCb) {
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

    WTrack.aggregate([{
            $match: //reconcile: true

            {dateByMonth: {$lte: 201511, $gte: 201511}}
            // {dateByWeek: {$eq: 201401}}

        }, {
            $group: {
                _id: '$dateByMonth',
                employees: {$addToSet: '$employee'},
                dateByWeek: {$addToSet: '$dateByWeek'}
            }
        }, {
            $lookup: {
                from: 'MonthHours',
                localField: '_id',
                foreignField: 'dateByMonth',
                as: '_id'
            }
        }, {
            $project: {
                _id: {$arrayElemAt: ['$_id', 0]},
                employees: 1,
                dateByWeek: 1
            }
        }, {
            $lookup: {
                from: 'Vacation',
                localField: '_id.dateByMonth',
                foreignField: 'dateByMonth',
                as: 'vacations'
            }
        }, {
            $project: {
                vacations: 1,
                employees: 1,
                dateByWeek: 1,
                overheadRate: '$_id.overheadRate',
                hoursInMonth: '$_id.hours',
                dateByMonth: '$_id.dateByMonth'
            }
        }, {
            $unwind: '$employees'
        }, {
            $lookup: {
                from: 'Employees',
                localField: 'employees',
                foreignField: '_id',
                as: 'employees'
            }
        }, {
            $project: {
                vacations: 1,
                employees: {$arrayElemAt: ['$employees', 0]},
                dateByWeek: 1,
                overheadRate: 1,
                hoursInMonth: 1,
                dateByMonth: 1
            }
        }, {
            $lookup: {
                from: 'Holiday',
                localField: 'dateByMonth',
                foreignField: 'dateByMonth',
                as: 'holidays'
            }
        }, {
            $project: {
                vacations: {
                    $filter: {
                        input: "$vacations",
                        as: "vacation",
                        cond: {$eq: ["$$vacation.employee", '$employees._id']}
                    }
                },
                holidays: 1,
                transfer: '$employees.transfer',
                dateByWeek: 1,
                employees: '$employees._id',
                dateByMonth: 1,
                hoursInMonth: 1,
                overheadRate: 1
            }
        }, {
            $group: {
                _id: {
                    employees: '$employees',
                    dateByMonth: '$dateByMonth',
                    overheadRate: '$overheadRate',
                    hoursInMonth: '$hoursInMonth'
                },
                vacations: {$addToSet: '$vacations'},
                holidays: {$addToSet: '$holidays'},
                transfer: {$addToSet: '$transfer'},
                dateByWeek: {$addToSet: '$dateByWeek'},
                dateByMonth: {$addToSet: '$dateByMonth'}
            }
        }, {
            $project: {
                dateByMonth: {$arrayElemAt: ['$dateByMonth', 0]},
                dateByWeek: {$arrayElemAt: ['$dateByWeek', 0]},
                transfer: {$arrayElemAt: ['$transfer', 0]},
                vacations: {$arrayElemAt: ['$vacations', 0]},
                holidays: {$arrayElemAt: ['$holidays', 0]}
            }
        }, {
            $lookup: {
                from: 'wTrack',
                localField: '_id.employees',
                foreignField: 'employee',
                as: 'wTracks'
            }
        }, {
            $project: {
                dateByMonth: 1,
                dateByWeek: 1,
                transfer: 1,
                vacations: 1,
                holidays: 1,
                wTracks: {
                    $filter: {
                        input: "$wTracks",
                        as: "wTrack",
                        cond: {$eq: ["$$wTrack.dateByMonth", '$dateByMonth']}
                    }
                }
            }
        }
        ],
        function (err, result) {
            if (err) {
                return console.log(err);
            }

            var createDirect = function (wfCb) {

                result.forEach(function (element) {
                    var employee = element._id.employees;
                    var overheadRate = element._id.overheadRate;
                    var hoursInMonth = element._id.hoursInMonth;
                    var dateByMonth = element.dateByMonth;
                    var vacations = element.vacations;
                    var holidays = element.holidays;
                    var transfer = element.transfer;
                    var wTracks = element.wTracks;
                    var holidaysObject = {};

                    holidays.forEach(function (holiday) {
                        var holidayDate = moment(holiday.date);
                        var key = (holidayDate.year() * 100 + holidayDate.month() + 1) * 100 + holidayDate.date();
                        holidaysObject[key] = true;
                    });

                    if (dateByMonth) {
                        var year = dateByMonth.toString().slice(0, 4);
                        var month = dateByMonth.toString().slice(4);
                        var startDareForMonth = moment().year(year).month(month - 1).startOf('month');
                        var endDareForMonth = moment().year(year).month(month - 1).endOf('month');
                        var hireObject = _.filter(transfer, function (result) {
                            return result.status === 'hired';
                        });
                        var timeToSet = {hour: 15, minute: 1, second: 0, millisecond: 0};
                        var datesArray = [];
                        var hireDate = hireObject && hireObject.length ? hireObject[0].date : null;
                        var hireDay = moment(hireDate).date();
                        var hireDateByMonth = moment(hireDate).year() * 100 + moment(hireDate).month() + 1;

                        if (hireDateByMonth === dateByMonth) {
                            startDareForMonth = moment(startDareForMonth).date(hireDay);
                        } else if (hireDateByMonth > dateByMonth) {
                            console.log('hired later', employee)
                        }

                        dateByMonthArray.push(dateByMonth);

                        var endDay = moment(endDareForMonth).date();
                        var startDay = moment(startDareForMonth).date();

                        for (var i = endDay; i >= startDay; i--) {
                            datesArray.push(moment(startDareForMonth).date(i));
                        }

                        datesArray.forEach(function (date) {
                            Model.remove({
                                date: date.set(timeToSet),
                                'sourceDocument.model': 'Employees'
                            }, function (err, result) {
                                var salaryForDate = 0;
                                var vacationObject;
                                var holiday;
                                var costForHour = 0;
                                var sameHoliday = false;
                                var sameVacation = false;
                                var dayOfMonth = moment(date).date();
                                var day = moment(date).day();
                                var transferLength = transfer.length;
                                var dateKey = (moment(date).year() * 100 + moment(date).month() + 1) * 100 + moment(date).date();
                                var dateByWeek = moment(date).year() * 100 + moment(date).isoWeek();
                                var wTracksForWeek;

                                wTracksForWeek = _.filter(wTracks, function (el) {
                                    return el.dateByWeek === dateByWeek;
                                });

                                sameHoliday = holidaysObject[dateKey];

                                vacationObject = _.find(vacations, function (vacation) {
                                    return vacation.dateByMonth === dateByMonth
                                });

                                if (vacationObject && vacationObject.vacArray) {
                                    if (vacationObject.vacArray[dayOfMonth - 1] && (vacationObject.vacArray[dayOfMonth - 1] !== "P") && (vacationObject.vacArray[dayOfMonth - 1] !== "E")) {
                                        sameVacation = true;
                                    }
                                }

                                for (var i = transferLength - 1; i >= 0; i--) {
                                    var transferObj = transfer[i];

                                    if (moment(date).isAfter(moment(transferObj.date))) {
                                        if (transferObj.status === 'fired') {
                                            if (transfer[i - 1] && moment(date).isAfter(transfer[i - 1].date)) {
                                                salaryForDate = transferObj.salary;
                                                break;
                                            }
                                        } else {
                                            salaryForDate = transferObj.salary;
                                            break;
                                        }
                                    }
                                }

                                costForHour = isFinite(salaryForDate / hoursInMonth) ? salaryForDate / hoursInMonth : 0;

                                if (!createdDateObject[dateKey]) {
                                    createdDateObject[dateKey] = {};
                                    createdDateObject[dateKey].employees = {};
                                }

                                if (!createdDateObject[dateKey].employees[employee]) {
                                    createdDateObject[dateKey].employees[employee] = {
                                        vacation: 0,
                                        hours: 0,
                                        wTracks: {}
                                    }
                                }


                                Model.remove({
                                    "sourceDocument._id": {$in: wTracksForWeek}
                                }, function () {
                                    wTracksForWeek.forEach(function (wTrack) {

                                        if (day === 0) {
                                            day = 7;
                                        }

                                        var sourceDocumentId = wTrack._id;
                                        var hours = wTrack[day];

                                        var bodySalary = {
                                            currency: CONSTANTS.CURRENCY_USD,
                                            journal: CONSTANTS.SALARY_PAYABLE,
                                            date: date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id: sourceDocumentId
                                            }
                                        };

                                        var bodyVacation = {
                                            currency: CONSTANTS.CURRENCY_USD,
                                            journal: CONSTANTS.VACATION_PAYABLE,
                                            date: date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'Employees',
                                                _id: employee
                                            }
                                        };

                                        var bodyOvertime = {
                                            currency: CONSTANTS.CURRENCY_USD,
                                            journal: CONSTANTS.OVERTIME_PAYABLE,
                                            date: date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id: sourceDocumentId
                                            }
                                        };

                                        var bodyOverhead = {
                                            currency: CONSTANTS.CURRENCY_USD,
                                            journal: CONSTANTS.OVERHEAD,
                                            date: date.set(timeToSet),
                                            sourceDocument: {
                                                model: 'wTrack',
                                                _id: sourceDocumentId
                                            }
                                        };


                                        if (day <= 5 && !sameHoliday) {
                                            if (hours - HOURSCONSTANT >= 0) {
                                                bodySalary.amount = costForHour * HOURSCONSTANT * 100;
                                                bodyOvertime.amount = costForHour * (hours - HOURSCONSTANT) * 100;
                                                bodyOverhead.amount = overheadRate * HOURSCONSTANT * 100;
                                            } else {
                                                bodySalary.amount = costForHour * hours * 100;
                                                bodyOvertime.amount = 0;
                                                bodyOverhead.amount = overheadRate * hours * 100;
                                            }

                                            if (sameVacation) {
                                                bodyOvertime.amount = costForHour * hours * 100;
                                                bodyOverhead.amount = overheadRate * hours * 100;
                                                bodySalary.amount = 0;

                                                if (!createdDateObject[dateKey].employees[employee].vacation) {
                                                    createdDateObject[dateKey].employees[employee].vacation = HOURSCONSTANT;
                                                    bodyVacation.amount = costForHour * HOURSCONSTANT * 100;
                                                }
                                            }

                                            if (!createdDateObject[dateKey].employees[employee].wTracks[sourceDocumentId]) {
                                                createdDateObject[dateKey].employees[employee].wTracks[sourceDocumentId] = 0;
                                            }

                                            createdDateObject[dateKey].employees[employee].costForHour = costForHour;
                                            createdDateObject[dateKey].employees[employee].hours += hours;
                                            createdDateObject[dateKey].employees[employee].wTracks[sourceDocumentId] += hours;
                                        } else {
                                            bodyOvertime.amount = costForHour * hours * 100;
                                            bodyOverhead.amount = overheadRate * hours * 100;

                                            if (sameHoliday) {
                                                bodyOvertime.amount = costForHour * hours * 100;
                                            }
                                        }

                                        //if (overtime) {
                                        //    bodyOvertime.amount = costForHour * hours * 100;
                                        //    bodyOverhead.amount = overheadRate * hours * 100;
                                        //}

                                        var methodCb = function () {

                                        };


                                        createReconciled(bodySalary, "production", methodCb, "52203e707d4dba8813000003");
                                        createReconciled(bodyOvertime, "production", methodCb, "52203e707d4dba8813000003");
                                        createReconciled(bodyOverhead, "production", methodCb, "52203e707d4dba8813000003");
                                        createReconciled(bodyVacation, "production", methodCb, "52203e707d4dba8813000003");
                                    });
                                });

                            });
                        });
                    }


                });

                wfCb(null, createdDateObject);
            };

            var dataFinder = function (createdDateObject, wfCb) {
                var holidaysObject = {};
                var vacationObject = {};
                var monthHoursObject = {};

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

                var monthHoursFinder = function (parallelCb) {
                    var dateByMonth = _.uniq(dateByMonthArray);

                    async.each(dateByMonth, function (key, cb) {
                        var year = parseInt(key.toString().slice(0, 4), 10);
                        var month = parseInt(key.toString().slice(4, 6), 10);

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

                async.parallel([vacationFinder, holidaysFinder, monthHoursFinder], function (err, result) {
                    if (err) {
                        return wfCb(err);
                    }

                    wfCb(null, {
                        monthHours: result[2],
                        createdDateObject: createdDateObject,
                        vacations: result[0],
                        holidays: result[1]
                    });
                });
            };

            var findAllDevs = function (createdDateObject, wfCb) {
                var keys = Object.keys(createdDateObject.createdDateObject);

                var firstKey = keys[0];
                var lastKey = keys[keys.length - 1];

                var startYear = parseInt(firstKey.slice(0, 4), 10);
                var startMonth = parseInt(firstKey.slice(4, 6), 10);
                var dateOfMonth = parseInt(firstKey.slice(6), 10);
                var date = moment().year(startYear).month(startMonth - 1).date(dateOfMonth);
                var endYear = parseInt(lastKey.slice(0, 4), 10);
                var endMonth = parseInt(lastKey.slice(4, 6), 10);
                var endDateOfMonth = parseInt(lastKey.slice(6), 10);
                var endDate = moment().year(endYear).month(endMonth - 1).date(endDateOfMonth);

                var startDateKey = startYear * 100 + moment(date).isoWeek();
                var endDateKey = endYear * 100 + moment(endDate).isoWeek();

                var matchObj = {
                    $and: [{
                        $or: [{
                            $and: [{
                                isEmployee: true
                            }, {
                                firstHire: {
                                    $ne: null,
                                    $lte: endDateKey
                                }
                            }]
                        }, {
                            $and: [{
                                isEmployee: false
                            }, {
                                lastFire: {
                                    $ne: null,
                                    $gte: startDateKey
                                }
                            }, {
                                firstHire: {
                                    $ne: null,
                                    $lte: endDateKey
                                }
                            }]
                        }
                        ]
                    }]
                };

                Employee
                    .aggregate([{
                        $match: {
                            'department': {$nin: notDevArray},
                            hire: {$ne: []}
                        }
                    }, {
                        $project: {
                            isEmployee: 1,
                            hire: 1,
                            transfer: 1,
                            name: 1,
                            lastFire: 1,
                            firstHire: {
                                $let: {
                                    vars: {
                                        firstHired: {$arrayElemAt: ["$hire", 0]}
                                    },
                                    in: {$add: [{$multiply: [{$year: '$$firstHired'}, 100]}, {$week: '$$firstHired'}]}
                                }
                            }
                        }
                    }, /*{
                        $match: {
                            $or: [{
                                _id: ObjectId("55b92ad221e4b7c40f000034")
                            },
                                matchObj
                            ]
                        }
                    },*/ {
                        $project: {
                            _id: 1,
                            hire: 1,
                            transfer: 1
                        }
                    }], function (err, result) {
                        if (err) {
                            return wfCb(err);
                        }

                        var emps = _.pluck(result, '_id');

                        wfCb(null, createdDateObject, {emps: emps, salary: result});
                    });
            };

            var createIdle = function (createdDateObject, empResult, wfCb) {
                var dates = Object.keys(createdDateObject.createdDateObject);
                var newDates = _.uniq(dates);

                async.each(newDates, function (dateKey, asyncCb) {
                    var year = parseInt(dateKey.slice(0, 4), 10);
                    var month = parseInt(dateKey.slice(4, 6), 10);
                    var dateOfMonth = parseInt(dateKey.slice(6), 10);
                    var date = moment().year(year).month(month - 1).date(dateOfMonth);
                    var objectForDay = createdDateObject.createdDateObject[dateKey] || {};
                    var employeesObjects = objectForDay.employees || [];
                    var employeesIds = Object.keys(employeesObjects);
                    var vacationObject = createdDateObject.vacations;
                    var holidaysObject = createdDateObject.holidays;

                    console.log(dateKey);

                    var stringIds = [];

                    empResult.emps.forEach(function (el) {
                        stringIds.push(el.toString());
                    });

                    employeesIds.push(stringIds);

                    var allEmployees = _.flatten(employeesIds);

                    allEmployees = _.uniq(allEmployees);

                    var employeesCount = allEmployees.length;
                    var employeesWithSalary = empResult.salary;
                    var monthHours = createdDateObject.monthHours[year * 100 + month] || {};
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
                        date: date.set(timeToSet),
                        journal: CONSTANTS.IDLE_PAYABLE
                    }, function (err, result) {

                        async.each(allEmployees, function (employee) {
                            var empObject = employeesObjects[employee] || {};
                            var vacation = empObject.vacation;
                            var totalWorkedForDay = empObject.hours || 0;
                            var salary = 0;
                            var employeeNotTracked = _.find(employeesWithSalary, function (elem) {
                                return elem._id.toString() === employee.toString();
                            });
                            var transfer = employeeNotTracked ? employeeNotTracked.transfer : [];
                            var transferLength = transfer.length;
                            var j;
                            var costHour = 0;
                            var hours = monthHours.hours || 0;
                            var createVacation = false;
                            var department;


                            for (var i = transferLength - 1; i >= 0; i--) {
                                var transferObj = transfer[i];

                                if (moment(date).isAfter(moment(transferObj.date))) {
                                    if (transferObj.status === 'fired') {

                                        salary = 0;
                                        break;
                                        /*if (transfer[i - 1] && moment(date).isAfter(transfer[i - 1].date)) {
                                         salary = transferObj.salary;
                                         department = transferObj.department;
                                         }*/
                                    } else {
                                        salary = transferObj.salary;
                                        department = transferObj.department;
                                        break;
                                    }
                                }
                            }

                            if (!salary) {
                                return cb();
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

                            costHour = (isFinite(salary / hours) ? (salary / hours) : 0);

                            var bodySalaryIdle = {
                                currency: CONSTANTS.CURRENCY_USD,
                                journal: CONSTANTS.IDLE_PAYABLE,
                                date: date.set(timeToSet),
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
                                return cb();
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
                        });
                    });
                }, function (err, result) {
                    wfCb(err, {totalIdleObject: totalIdleObject, totalObject: createdDateObject.createdDateObject});
                });
            };

            async.waterfall([createDirect, dataFinder, findAllDevs, createIdle], function (err, result) {
                console.log('Success');
            });

        }
    )

})
;