var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas['journal'];
var journalEntrySchema = mongoose.Schemas['journalEntry'];
var CurrencySchema = mongoose.Schemas.Currency;
var MonthHoursSchema = mongoose.Schemas.monthHours;
var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;
var jobsSchema = mongoose.Schemas.jobs;
var invoiceSchema = mongoose.Schemas.Invoice;
var holidaysSchema = mongoose.Schemas.Holiday;
var vacationSchema = mongoose.Schemas.Vacation;
var objectId = mongoose.Types.ObjectId;
var redisStore = require('../helpers/redisClient');
var HOURSCONSTANT = 8;

var oxr = require('open-exchange-rates');
var fx = require('money');
var _ = require('underscore');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');

var Module = function (models) {
    "use strict";
    //ToDo set it to process.env
    oxr.set({app_id: 'b81387a200c2463e9ae3d31cc60eda62'});

    var access = require("../Modules/additions/access.js")(models);
    var CONSTANTS = require("../constants/mainConstants.js");

    this.removeBySourceDocument = function (req, sourceId) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);

        Model.find({"sourceDocument._id": sourceId}, function (err, result) {
            if (err) {
                return console.log(err);
            }

            var ids = [];

            result.forEach(function (el) {
                setReconcileDate(req, el.date);
                ids.push(el._id);
            });

            Model.remove({_id: {$in: ids}}, function (err, result) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    };

    this.setReconcileDate = function (req, date) {
        setReconcileDate(req, date);
    };

    function setReconcileDate(req, date) {
        var db = models.connection(req.session.lastDb);
        db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
            if (err) {
                return console.log(err);
            }
            var dateResult = result.date;
            var newDae = moment(date);
            var newReconcileDate = moment(dateResult);
            var lessDate = newDae.isBefore(newReconcileDate) ? true : false;

            if (lessDate) {
                db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: {date: new Date(newDae)}}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }
        });
    }

    this.reconcile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var Invoice = models.get(req.session.lastDb, 'Invoice', invoiceSchema);
        var Holidays = models.get(req.session.lastDb, 'Holiday', holidaysSchema);
        var Vacation = models.get(req.session.lastDb, 'Vacation', vacationSchema);
        var body = req.body;
        var date = new Date(body.date);
        var reconcileSalaryEntries;
        var reconcileInvoiceEntries;
        var timeToSet = {hour: 18, minute: 1, second: 0};
        var createdDateObject = {};
        var createDirect;
        var createOverhead;
        var parallelTasks;
        var waterfallForSalary;
        var wTrackFinder;
        var parallelFunctionRemoveCreate;
        var removeBySource;
        var create;
        var createIdleOvertime;
        var parallelRemoveCreate;
        var waterfallCreateEntries;
        var wTracks;
        var mainVacationCost = 0;

        reconcileInvoiceEntries = function (mainCallback) {
            Invoice.find({reconcile: true}, function (err, result) {
                if (err) {
                    return pCb(err);
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
                            journalEntryBody.journal = invoice.journal;
                            journalEntryBody.currency = invoice.currency ? invoice.currency._id : 'USD';
                            journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
                            journalEntryBody.sourceDocument = {};
                            journalEntryBody.sourceDocument._id = invoice._id;
                            journalEntryBody.sourceDocument.model = 'Invoice';

                            createReconciled(journalEntryBody, req.session.lastDb, asyncCb, req.session.uId);
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
        };

        reconcileSalaryEntries = function (mainCallback) {

            wTrackFinder = function (wfcallback) {
                WTrack.find({reconcile: true}, function (err, result) {
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
                        var j;
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
                var dateByWeekArray = wTrackResultObject.weekKeys;
                var salaryObject = {};
                var monthHoursObject = {};
                var holidaysObject = {};
                var vacationObject = {};

                removeBySource = function (pbc) {
                    Model.remove({
                        "sourceDocument._id": {$in: wTrackIds}
                    }, pbc);
                };

                create = function (pcb) {

                    createDirect = function (createWaterfallCb) {
                        var salaryFinder = function (parallelCb) {
                            var query = Employee.find({_id: {$in: employeesArray}}, {hire: 1}).lean();

                            query.exec(function (err, employees) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                employees.forEach(function (employee) {
                                    var hireArray = employee.hire;
                                    if (!salaryObject[employee._id]) {
                                        salaryObject[employee._id] = {};
                                    }

                                    hireArray.forEach(function (hireObj) {
                                        salaryObject[employee._id][hireObj.date] = hireObj.salary || 0;
                                    });
                                });

                                parallelCb(null, salaryObject);
                            });
                        };

                        var monthHoursFinder = function (parallelCb) {
                            async.each(dateByMonthArray, function (key, cb) {
                                redisStore.readFromStorage('monthHours', key, function (err, result) {

                                    if (!monthHoursObject[key]) {
                                        monthHoursObject[key] = {};
                                    }

                                    result = JSON.parse(result);
                                    monthHoursObject[key] = result;
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
                                    var key = (holidayDate.isoWeekYear() * 100 + holidayDate.month() + 1) * 100 + holidayDate.date();
                                    holidaysObject[key] = true;
                                });

                                parallelCb(null, holidaysObject);
                            });
                        };

                        var vacationFinder = function (parallelCb) {
                            var query = Vacation.find({
                                employee: {$in: employeesArray}
                            }).lean();

                            query.exec(function (err, result) {
                                if (err) {
                                    return parallelCb(err);
                                }

                                result.forEach(function (vacation) {
                                    if (!vacationObject[vacation.employee]) {
                                        vacationObject[vacation.employee] = {};
                                    }
                                    var newDate = moment().isoWeekYear(vacation.year).month(vacation.month - 1).date(1);
                                    var vacArray = vacation.vacArray;
                                    var length = vacArray.length;
                                    var i;

                                    for (i = length - 1; i >= 0; i--) {
                                        if (vacArray[i]) {
                                            var key = (newDate.date(i + 1).isoWeekYear() * 100 + newDate.date(i + 1).month() + 1) * 100 + i + 1;
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
                                for (j = 7; j >= 1; j--) {
                                    dataObject[j] = moment([wTrackModel.year, wTrackModel.month - 1]).isoWeek(wTrackModel.week).day(j);
                                }

                                keys = Object.keys(dataObject);
                                methodCb = _.after(keys.length * 4, asyncCb);

                                keys.forEach(function (i) {
                                    var hours = wTrackModel[i];
                                    var date = dataObject[i];
                                    var day = i;
                                    var dateByMonth = wTrackModel.dateByMonth;
                                    var monthHours = monthHoursObject[dateByMonth];
                                    var adminCoefficient = monthHours[0].adminCoefficient || 0;
                                    var employeeSalary = salaryObject[employeeSubject];
                                    var salary = 0;
                                    var salaryChangeDates = Object.keys(employeeSalary);
                                    var costHour;
                                    var hoursInMonth = monthHours[0].hours;
                                    var dateKey = (date.isoWeekYear() * 100 + date.month() + 1) * 100 + date.date();
                                    var holidayDate = holidaysObject[dateKey];
                                    var sameDayHoliday = holidayDate;
                                    var vacationForEmployee = vacationObject[employeeSubject] || {};
                                    var vacationSameDate = vacationForEmployee[dateKey];

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
                                            createdDateObject[dateKey].total = 0;
                                            createdDateObject[dateKey].totalVacationCost = 0;
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

                                        var bodyOverheadAdmin = {
                                            currency      : CONSTANTS.CURRENCY_USD,
                                            journal       : CONSTANTS.OVERHEAD_ADMIN,
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
                                                bodyOverheadAdmin.amount = adminCoefficient * HOURSCONSTANT * 100;

                                                createdDateObject[dateKey].total += HOURSCONSTANT;
                                            } else {
                                                bodySalary.amount = costHour * hours * 100;
                                                bodyOvertime.amount = 0;
                                                bodyOverheadAdmin.amount = adminCoefficient * hours * 100;

                                                createdDateObject[dateKey].total += hours;
                                            }

                                            if (vacationSameDate) {
                                                if (vacationForEmployee[dateKey] === "V" || "S") {
                                                    bodyOvertime.amount = costHour * hours * 100;
                                                    bodySalary.amount = 0;
                                                    bodyOverheadAdmin.amount = adminCoefficient * hours * 100;

                                                    if (!createdDateObject[dateKey].employees[employeeSubject].vacation) {
                                                        createdDateObject[dateKey].employees[employeeSubject].vacation = HOURSCONSTANT;
                                                        createdDateObject[dateKey].totalVacationCost += costHour * HOURSCONSTANT * 100;
                                                        mainVacationCost += costHour * HOURSCONSTANT * 100;
                                                        bodyVacation.amount = costHour * HOURSCONSTANT * 100;

                                                        createdDateObject[dateKey].total -= hours;
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
                                            bodyOverheadAdmin.amount = adminCoefficient * hours * 100;

                                            if (sameDayHoliday) {
                                                bodyOvertime.amount = costHour * hours * 100;
                                            }
                                        }

                                        createReconciled(bodySalary, req.session.lastDb, methodCb, req.session.uId);
                                        createReconciled(bodyOvertime, req.session.lastDb, methodCb, req.session.uId);
                                        createReconciled(bodyOverheadAdmin, req.session.lastDb, methodCb, req.session.uId);
                                        createReconciled(bodyVacation, req.session.lastDb, methodCb, req.session.uId);

                                    });

                                });
                            }, function () {
                                createWaterfallCb(null, createdDateObject);
                            });
                        });
                    };

                    createIdleOvertime = function (totalObject, createWaterfallCb) {
                        var dates = Object.keys(totalObject);
                        var totalIdleObject = {};
                        var notUsedVacationCost = 0;

                        console.dir(totalObject);

                        async.each(dates, function (dateKey, asyncCb) {
                            var vacationRateForDay;
                            var year = dateKey.slice(0, 4);
                            var month = dateKey.slice(4, 6);
                            var dateOfMonth = dateKey.slice(6);
                            var date = moment().isoWeekYear(year).month(month - 1).date(dateOfMonth);
                            var objectForDay = totalObject[dateKey];
                            var totalHours = objectForDay.total;
                            var totalVacationCost = objectForDay.totalVacationCost;
                            var employeesObjects = objectForDay.employees;
                            var employeesIds = Object.keys(objectForDay.employees);
                            var employeesCount = employeesIds.length;
                            var i;
                            var ourCb = _.after(employeesCount, asyncCb);

                            if (!totalIdleObject[dateKey]) {
                                totalIdleObject[dateKey] = 0;
                            }


                            vacationRateForDay = isFinite((notUsedVacationCost + totalVacationCost) / totalHours) ? (notUsedVacationCost + totalVacationCost) / totalHours : 0;

                            for (i = employeesCount - 1; i >= 0; i--) {
                                var employee = employeesIds[i];
                                var empObject = employeesObjects[employee];
                                var wTracks = empObject.wTracks;
                                var sourceDocuments = Object.keys(wTracks);
                                var vacation = empObject.vacation;
                                var totalWorkedForDay = empObject.hours;
                                var costHour = empObject.costHour;

                                async.each(sourceDocuments, function (sourceDoc, asyncCb) {

                                    var bodyOverheadVacation = {
                                        currency      : CONSTANTS.CURRENCY_USD,
                                        journal       : CONSTANTS.OVERHEAD_VACATION,
                                        date          : date.set(timeToSet),
                                        sourceDocument: {
                                            model: 'wTrack'
                                        }
                                    };

                                    var bodySalaryIdle = {
                                        currency      : CONSTANTS.CURRENCY_USD,
                                        journal       : CONSTANTS.IDLE_PAYABLE,
                                        date          : date.set(timeToSet),
                                        sourceDocument: {
                                            model: 'wTrack'
                                        }
                                    };

                                    var bodySalaryOvertime = {
                                        currency      : CONSTANTS.CURRENCY_USD,
                                        journal       : CONSTANTS.OVERTIME_PAYABLE,
                                        date          : date.set(timeToSet),
                                        sourceDocument: {
                                            model: 'wTrack'
                                        }
                                    };

                                    var callB = _.after(3, asyncCb);
                                    var totalWorked = wTracks[sourceDoc];
                                    var idleTime = HOURSCONSTANT - totalWorkedForDay;
                                    var idleCoeff = idleTime / totalWorkedForDay;

                                    bodyOverheadVacation.sourceDocument._id = sourceDoc;
                                    bodySalaryIdle.sourceDocument._id = sourceDoc;
                                    bodySalaryOvertime.sourceDocument._id = sourceDoc;

                                    if (totalWorkedForDay - HOURSCONSTANT < 0) {
                                        if (!vacation) {
                                            if (totalWorked - HOURSCONSTANT >= 0) {
                                                bodySalaryOvertime.amount = costHour * (totalWorked - HOURSCONSTANT) * 100;
                                                bodySalaryIdle.amount = 0;
                                            } else {
                                                bodySalaryOvertime.amount = 0;
                                                bodySalaryIdle.amount = costHour * totalWorked * idleCoeff * 100;
                                                totalIdleObject[dateKey] += costHour * totalWorked * idleCoeff * 100;
                                            }

                                            bodyOverheadVacation.amount = vacationRateForDay * totalWorked;
                                            notUsedVacationCost -= vacationRateForDay * totalWorked;
                                        } else {
                                            bodySalaryOvertime.amount = 0;
                                            bodySalaryIdle.amount = 0;
                                            bodyOverheadVacation.amount = 0;
                                        }
                                    } else {
                                        bodySalaryOvertime.amount = 0;
                                        bodySalaryIdle.amount = 0;
                                        bodyOverheadVacation.amount = 0;

                                        if (!vacation && vacationRateForDay && totalWorked){
                                            bodyOverheadVacation.amount = vacationRateForDay * totalWorked;
                                            notUsedVacationCost -= vacationRateForDay * totalWorked;
                                        }
                                    }

                                    createReconciled(bodyOverheadVacation, req.session.lastDb, callB, req.session.uId);
                                    createReconciled(bodySalaryIdle, req.session.lastDb, callB, req.session.uId);
                                    createReconciled(bodySalaryOvertime, req.session.lastDb, callB, req.session.uId);
                                }, function () {
                                    ourCb();
                                });

                            }

                            if (totalVacationCost && !totalHours){
                                notUsedVacationCost += totalVacationCost;
                            }

                        }, function (err, result) {
                            if (notUsedVacationCost){
                                mainVacationCost += notUsedVacationCost;
                            }
                            createWaterfallCb(err, {totalIdleObject: totalIdleObject, totalObject: totalObject});
                        });

                    };

                    createOverhead = function (prevResult, createWaterfallCb) {
                        var totalIdleObject = prevResult.totalIdleObject;
                        var totalObject = prevResult.totalObject;

                        var dates = Object.keys(totalObject);

                        async.each(dates, function (dateKey, cb) {
                            var idleForDay = totalIdleObject[dateKey] || 0;
                            var totalHoursForDay = totalObject[dateKey].total;
                            var idleRateForDay = isFinite(idleForDay / totalHoursForDay) ? idleForDay / totalHoursForDay : 0;
                            var employeesObjects = totalObject[dateKey].employees;
                            var employeesIds = Object.keys(employeesObjects);
                            var employeesCount = employeesIds.length;
                            var year = dateKey.slice(0, 4);
                            var month = dateKey.slice(4, 6);
                            var dateOfMonth = dateKey.slice(6);
                            var date = moment().isoWeekYear(year).month(month - 1).date(dateOfMonth);
                            var i;
                            var ourCb = _.after(employeesCount, cb);

                            for (i = employeesCount - 1; i >= 0; i--) {
                                var employee = employeesIds[i];
                                var empObject = employeesObjects[employee];
                                //var totalWorked = empObject.hours;
                                var totalWorked;
                                var wTracks = empObject.wTracks;
                                var sourceDocuments = Object.keys(wTracks);

                                async.each(sourceDocuments, function (sourceDoc, asyncCb) {
                                    var bodyOverheadIdle = {
                                        currency      : CONSTANTS.CURRENCY_USD,
                                        journal       : CONSTANTS.OVERHEAD_IDLE,
                                        date          : date.set(timeToSet),
                                        sourceDocument: {
                                            model: 'wTrack',
                                            _id  : sourceDoc
                                        }
                                    };

                                    totalWorked = wTracks[sourceDoc];

                                    bodyOverheadIdle.amount = idleRateForDay * totalWorked;

                                    createReconciled(bodyOverheadIdle, req.session.lastDb, asyncCb, req.session.uId);

                                }, function () {
                                    ourCb();
                                });

                            }

                        }, function (err, result) {
                            createWaterfallCb(err, result);
                        });

                    };

                    waterfallCreateEntries = [createDirect, createIdleOvertime, createOverhead];

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

        parallelTasks = [reconcileInvoiceEntries, reconcileSalaryEntries];

        async.parallel(parallelTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
            var db = models.connection(req.session.lastDb);
            var setObj = {date: date};

            if (mainVacationCost){
                setObj.vacationCost = mainVacationCost;
            }

            WTrack.update({_id: {$in: wTracks}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {

            });

            db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: setObj}, function (err, result) {
                if (err) {
                    return next(err);
                }

            });
        });

    };

    /*  this.reconcile = function (req, res, next) {
     var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
     var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
     var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
     var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
     var Invoice = models.get(req.session.lastDb, 'Invoice', invoiceSchema);
     var Holidays = models.get(req.session.lastDb, 'Holiday', holidaysSchema);
     var Vacation = models.get(req.session.lastDb, 'Vacation', vacationSchema);
     var body = req.body;
     var date = new Date(body.date);
     //var dateKey = moment(date).year() * 100 + moment(date).isoWeek();
     //var dateKeyNext = (moment(date).year() + 1) * 100 + moment(date).isoWeek();
     var dateKey = 201501;
     var dateKeyNext = 201520;
     var reconcileSalaryEntries;
     var reconcileInvoiceEntries;
     var timeToSet = {hour: 18, minute: 1, second: 0};
     var createdDateObject = {};

     reconcileInvoiceEntries = function (parallelCb) {
     Invoice.find({reconcile: true}, function (err, result) {
     if (err) {
     return parallelCb(err);
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
     journalEntryBody.journal = invoice.journal;
     journalEntryBody.currency = invoice.currency ? invoice.currency._id : 'USD';
     journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
     journalEntryBody.sourceDocument = {};
     journalEntryBody.sourceDocument._id = invoice._id;
     journalEntryBody.sourceDocument.model = 'Invoice';

     createReconciled(journalEntryBody, req.session.lastDb, asyncCb, req.session.uId);
     });
     }, function () {
     cb();
     });
     };

     var parallelTasks = [parallelRemove, parallelCreate];

     async.parallel(parallelTasks, function (err, result) {
     if (err) {
     return parallelCb(err);
     }

     Invoice.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function () {

     });

     parallelCb();
     });
     });
     };

     reconcileSalaryEntries = function (parallelCb) {
     WTrack.find({reconcile: true}, function (err, result) {
     if (err) {
     return parallelCb(err);
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
     return next(err);
     }

     cb();
     });
     };
     var parallelCreate = function (cb) {
     async.each(resultArray, function (element, asyncCb) {
     WTrack.findById(element, function (err, wTrackResult) {
     if (err) {
     return asyncCb(err);
     }
     var counter = 0;
     var dataObject = {};
     for (var j = 7; j >= 1; j--) {
     dataObject[j] = moment([wTrackResult.year, wTrackResult.month - 1]).isoWeek(wTrackResult.week).day(j);
     }

     var keys = Object.keys(dataObject);

     keys.forEach(function (i) {
     var hours = wTrackResult[i];
     var date = dataObject[i];
     var day = i;

     var salaryFinder = function (pcb) {
     var query = Employee.findById(wTrackResult.employee, {hire: 1}).lean();
     query.exec(function (err, element) {
     if (err) {
     return cb(err);
     }
     var salary = 0;
     var i;
     var hire = element.hire;
     var length = hire.length;
     for (i = length - 1; i >= 0; i--) {
     if (date >= hire[i].date) {
     salary = hire[i].salary;
     break;
     }
     }

     pcb(null, salary);
     });
     };

     var monthHoursFinder = function (pcb) {
     var key = wTrackResult.dateByMonth;
     redisStore.readFromStorage('monthHours', key, function (err, result) {
     if (err) {
     return cb(err);
     }

     result = JSON.parse(result);
     pcb(null, result[0] || {});
     });
     };

     var holidaysFinder = function (pcb) {
     var query = Holidays.find({
     year: wTrackResult.year,
     week: wTrackResult.week
     }).lean();

     query.exec(function (err, element) {
     if (err) {
     return cb(err);
     }

     pcb(null, element[0] || {});
     });
     };

     var vacationFinder = function (pcb) {
     var query = Vacation.find({
     year    : wTrackResult.year,
     month   : wTrackResult.month,
     employee: wTrackResult.employee
     }).lean();

     query.exec(function (err, element) {
     if (err) {
     return cb(err);
     }

     var vacation = element[0] || {};
     var vacArray;
     var resultObject = {};
     var newDate;

     if (vacation && vacation.vacations && vacation.vacations[wTrackResult.dateByWeek]) {
     vacArray = vacation.vacArray;
     newDate = moment().isoWeekYear(vacation.year).month(vacation.month - 1).date(1);

     for (var i = vacArray.length - 1; i >= 0; i--) {
     if (vacArray[i]) {
     var key = (newDate.date(i + 1).year() * 100 + newDate.date(i + 1).month() + 1) * 100 + i + 1;
     resultObject[key] = vacArray[i];
     }
     }
     }

     pcb(null, resultObject);
     });
     };

     async.parallel([salaryFinder, monthHoursFinder, holidaysFinder, vacationFinder], function (err, result) {
     if (err) {
     return asyncCb(err);
     }
     var vacation = result[3];
     var holiday = result[2];
     var holidayDate = holiday.date;
     var sameDate = moment(holidayDate).isSame(date);
     var dateKey = (date.year() * 100 + date.month() + 1) * 100 + date.date();
     var vacationSameDate = vacation[dateKey] ? true : false;
     var monthHoursModel = result[1];
     var salary = result[0];
     var hoursInMonth = monthHoursModel.hours;
     var vacationCoefficient = monthHoursModel.vacationCoefficient || 0;
     var adminCoefficient = monthHoursModel.adminCoefficient || 0;
     var idleCoefficient = monthHoursModel.idleCoefficient || 0;

     var costHour = isFinite(salary / hoursInMonth) ? salary / hoursInMonth : 0;

     if (!createdDateObject[dateKey]){
     createdDateObject[dateKey] = {};
     createdDateObject[dateKey].employees = {};
     createdDateObject[dateKey].total = 0;
     createdDateObject[dateKey].totalVacationHours = 0;
     createdDateObject[dateKey].totalVacationCost = 0;
     }

     if (!createdDateObject[dateKey].employees[wTrackResult.employee]){
     createdDateObject[dateKey].employees[wTrackResult.employee] = {
     vacation: 0,
     hours: 0
     }
     }


     var body = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc727e541812c07197356c',
     date          : date.set(timeToSet),
     sourceDocument: {
     model: 'wTrack',
     _id  : wTrackResult._id
     }
     };

     var bodyIdle = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc72c4541812c071973570',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'wTrack',
     _id  : wTrackResult._id
     }
     };

     var bodyOvertime = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc7383541812c071973574',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'wTrack',
     _id  : wTrackResult._id
     }
     };

     var bodyVacation = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc72a8541812c07197356e',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'wTrack',
     _id  : wTrackResult._id
     }
     };

     var bodyAdminCosts = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc734b541812c071973572',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'wTrack',
     _id  : wTrackResult._id
     }
     };

     var bodyHoliday = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : 'TODO',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'Employees',
     _id  : wTrackResult.employee
     }
     };

     var bodyJournalVacation = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : 'TODO',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'Employees',
     _id  : wTrackResult.employee
     }
     };

     if (day <= 5 && !sameDate) {
     if (hours - HOURSCONSTANT >= 0) {
     body.amount = costHour * HOURSCONSTANT * 100;
     bodyIdle.amount = idleCoefficient * HOURSCONSTANT * 100;
     bodyOvertime.amount = costHour * (hours - HOURSCONSTANT) * 100;
     } else {
     body.amount = costHour * hours * 100;
     bodyIdle.amount = idleCoefficient * hours * 100;
     bodyOvertime.amount = 0;
     }

     if (vacationSameDate) {
     if (vacation[dateKey] === "V" || "S") {
     bodyOvertime.amount = costHour * hours * 100;
     bodyJournalVacation.amount = costHour * HOURSCONSTANT * 100;
     createdDateObject[dateKey].employees[wTrackResult.employee].vacation = HOURSCONSTANT;
     createdDateObject[dateKey].totalVacationHours += HOURSCONSTANT;
     createdDateObject[dateKey].totalVacationCost += costHour * HOURSCONSTANT * 100;
     }
     }

     //bodyVacation.amount = vacationCoefficient * HOURSCONSTANT * 100;
     bodyAdminCosts.amount = adminCoefficient * hours * 100;

     createdDateObject[dateKey].total += hours;
     createdDateObject[dateKey].employees[wTrackResult.employee].hours += hours;
     //bodyHoliday.amount = 0;
     } else {
     bodyOvertime.amount = costHour * hours * 100;
     bodyAdminCosts.amount = adminCoefficient * hours * 100;
     //bodyHoliday.amount = 0;

     if (sameDate) {
     bodyOvertime.amount = costHour * hours * 100;
     }
     }



     var superCb = function () {
     counter++;

     if (counter === 28) {

     asyncCb();
     }
     };

     createReconciled(body, req.session.lastDb, superCb, req.session.uId, timeToSet);
     //createReconciled(bodyIdle, req.session.lastDb, superCb, req.session.uId, timeToSet);
     createReconciled(bodyOvertime, req.session.lastDb, superCb, req.session.uId, timeToSet);
     //createReconciled(bodyVacation, req.session.lastDb, superCb, req.session.uId, timeToSet);
     createReconciled(bodyAdminCosts, req.session.lastDb, superCb, req.session.uId, timeToSet);
     //createReconciled(bodyHoliday, req.session.lastDb, superCb, req.session.uId, timeToSet);
     createReconciled(bodyJournalVacation, req.session.lastDb, superCb, req.session.uId, timeToSet);
     });
     });
     });
     }, function (err, result) {
     cb();
     });
     };

     var parallelTasks = [parallelRemove, parallelCreate];

     async.parallel(parallelTasks, function (err, result) {
     if (err) {
     return parallelCb(err);
     }

     var dateKeys = Object.keys(createdDateObject);
     var bodyIdle = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc72c4541812c071973570',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'Employees'
     }
     };

     var bodyOvertime = {
     currency      : '565eab29aeb95fa9c0f9df2d',
     journal       : '56cc7383541812c071973574',
     date          : moment(date).set(timeToSet),
     sourceDocument: {
     model: 'Employees'
     }
     };

     dateKeys.forEach(function (date) {
     var dateObject = createdDateObject[date];
     var employees = Object.keys(dateObject.employees);
     var total = dateObject.total;
     var totalVacationHours = dateObject.totalVacationHours;
     var totalVacationCost = dateObject.totalVacationCost;

     var vacationRate = isFinite(totalVacationCost / totalVacationHours) ? totalVacationCost / totalVacationHours : 0;

     employees.forEach(function (employee) {
     var hours = employees[employee];

     if (hours > HOURSCONSTANT){
     bodyOvertime.amount = (hours - HOURSCONSTANT)
     }

     bodyIdle.sourceDocument._id = employee;
     bodyOvertime.sourceDocument._id = employee;

     createReconciled(bodyIdle, req.session.lastDb, superCb, req.session.uId, timeToSet);
     createReconciled(bodyOvertime, req.session.lastDb, superCb, req.session.uId, timeToSet);
     });

     });

     WTrack.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {

     });
     parallelCb();
     var db = models.connection(req.session.lastDb);

     db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: {date: date}}, function (err, result) {
     if (err) {
     return next(err);
     }

     });
     });
     });
     };
     async.parallel([reconcileInvoiceEntries, reconcileSalaryEntries], function (err, result) {
     if (err) {
     return next(err);
     }

     res.status(200).send({success: true});

     var db = models.connection(req.session.lastDb);

     db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: {date: date}}, function (err, result) {
     if (err) {
     return next(err);
     }

     });
     });
     };*/

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
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
        };

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    };

    this.getReconcileDate = function (req, res, next) {
        var db = models.connection(req.session.lastDb);

        db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({date: result.date});
        });
    };

    this.create = function (body, dbIndex, cb, uId) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var Currency = models.get(dbIndex, 'currency', CurrencySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;
        var rates;

        var waterfallTasks = [currencyNameFinder, journalFinder, journalEntrySave];

        date = date.format('YYYY-MM-DD');

        function currencyNameFinder(waterfallCb) {

            Currency.findById(body.currency, function (err, result) {
                if (err) {
                    waterfallCb(err);
                }

                waterfallCb(null, result.name);
            });
        }

        function journalFinder(currencyName, waterfallCb) {
            var err;

            if (!journalId) {
                err = new Error('Journal id is required field');
                err.status = 400;

                return waterfallCb(err);
            }

            currency = {
                name: currencyName
            };

            Journal.findById(journalId, waterfallCb);

        }

        function journalEntrySave(journal, waterfallCb) {
            oxr.historical(date, function () {
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
                            date: new Date()
                        };

                        debitObject.createdBy = {
                            user: uId,
                            date: new Date()
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
                            date: new Date()
                        };

                        creditObject.createdBy = {
                            user: uId,
                            date: new Date()
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

                rates = oxr.rates;
                currency.rate = rates[currency.name];

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
            });
        };

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return cb(err);
            }

            if (cb) {
                cb(null, response);
            }
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);

        Model.find({}).count(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        })

    };

    this.getAsyncData = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var query = req.query;
        var sourceDocument = query._id;
        var date = query.date;
        var debit;
        var credit;
        var wTrackFinder;
        var resultFinder;

        wTrackFinder = function (waterfallCb) {
            wTrackModel.find({jobs: objectId(sourceDocument)}, {_id: 1}, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                var newArray = [];

                result.forEach(function (el) {
                    newArray.push(el._id);
                });

                waterfallCb(null, newArray);
            });

        };

        resultFinder = function (sourceDocuments, waterfallCb) {
            debit = function (cb) {
                Model
                    .aggregate([{
                        $match: {
                            "sourceDocument.model": "wTrack",
                            "sourceDocument._id"  : {$in: sourceDocuments},
                            date                  : new Date(date),
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $lookup: {
                            from                   : "wTrack",
                            localField             : "sourceDocument._id",
                            foreignField: "_id", as: "sourceDocument"
                        }
                    }, {
                        $lookup: {
                            from                   : "journals",
                            localField             : "journal",
                            foreignField: "_id", as: "journal"
                        }
                    }, {
                        $project: {
                            date          : 1,
                            debit         : {$divide: ['$debit', '$currency.rate']},
                            sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
                            journal       : {$arrayElemAt: ["$journal", 0]}
                        }
                    }, {
                        $project: {
                            date          : 1,
                            debit         : 1,
                            sourceDocument: 1,
                            journal       : 1,
                            journalName   : "$journal.name"
                        }
                    }, {
                        $lookup: {
                            from                   : "chartOfAccount",
                            localField             : "journal.debitAccount",
                            foreignField: "_id", as: "journal.debitAccount"
                        }
                    }, {
                        $lookup: {
                            from                   : "chartOfAccount",
                            localField             : "journal.creditAccount",
                            foreignField: "_id", as: "journal.creditAccount"
                        }
                    }, {
                        $lookup: {
                            from                   : "Employees",
                            localField             : "sourceDocument.employee",
                            foreignField: "_id", as: "employee"
                        }
                    }, {
                        $project: {
                            date                   : 1,
                            debit                  : 1,
                            'journal.creditAccount': {$arrayElemAt: ["$journal.creditAccount", 0]},
                            'journal.debitAccount' : {$arrayElemAt: ["$journal.debitAccount", 0]},
                            employee               : {$arrayElemAt: ["$employee", 0]},
                            journalName            : 1
                        }
                    }, {
                        $project: {
                            date                   : 1,
                            debit                  : 1,
                            'journal.creditAccount': "$journal.creditAccount.name",
                            'journal.debitAccount' : "$journal.debitAccount.name",
                            'journalName'          : 1,
                            employee               : {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
                        }
                    }, {
                        $sort: {
                            date    : 1,
                            employee: 1,
                            journal : 1
                        }
                    }], function (err, result) {
                        if (err) {
                            cb(err);
                        }
                        cb(null, result);
                        //Journal.populate(result, {
                        //    path: 'journal'
                        //}, function (err, result) {
                        //    cb(null, result);
                        //
                        //});
                    });
            };

            /*credit = function (cb) {
             Model
             .aggregate([{
             $match: {
             "sourceDocument.model": "wTrack",
             "sourceDocument._id"  : {$in: sourceDocuments},
             date                  : new Date(date),
             credit                : {$gt: 0}
             }
             }, {
             $lookup: {
             from                   : "wTrack",
             localField             : "sourceDocument._id",
             foreignField: "_id", as: "sourceDocument"
             }
             }, {
             $project: {
             date          : 1,
             credit        : {$divide: ['$credit', '$currency.rate']},
             sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
             journal       : 1
             }
             }, {
             $lookup: {
             from                   : "Employees",
             localField             : "sourceDocument.employee",
             foreignField: "_id", as: "employee"
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$arrayElemAt: ["$employee", 0]}
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
             }
             }, {
             $sort: {
             date    : 1,
             employee: 1,
             journal : 1
             }
             }], function (err, result) {
             if (err) {
             cb(err);
             }

             Journal.populate(result, {
             path: 'journal'
             }, function (err, result) {
             cb(null, result);

             });
             });
             };*/

            async.parallel([debit/*, credit*/], function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, result[0]);
            });
        };

        async.waterfall([wTrackFinder, resultFinder], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({journalEntries: result});
        });
    };

    this.getForReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var query = req.query;
        var sourceDocument = query._id;
        var debit;
        var credit;
        var wTrackFinder;
        var resultFinder;

        wTrackFinder = function (waterfallCb) {
            wTrackModel.find({jobs: objectId(sourceDocument)}, {_id: 1}, function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                var newArray = [];

                result.forEach(function (el) {
                    newArray.push(el._id);
                });

                waterfallCb(null, newArray);
            });

        };

        resultFinder = function (sourceDocuments, waterfallCb) {
            debit = function (cb) {
                Model
                    .aggregate([{
                        $match: {
                            "sourceDocument.model": "wTrack",
                            "sourceDocument._id"  : {$in: sourceDocuments},
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $project: {
                            date : 1,
                            debit: {$divide: ['$debit', '$currency.rate']}
                        }
                    }, {
                        $group: {
                            _id     : '$date',
                            totalSum: {$sum: '$debit'}
                        }
                    }, {
                        $sort: {
                            _id: 1
                        }
                    }], function (err, result) {
                        if (err) {
                            cb(err);
                        }

                        Journal.populate(result, {
                            path: 'journal'
                        }, function (err, result) {
                            cb(null, result);

                        });
                    });
            };

            /*credit = function (cb) {
             Model
             .aggregate([{
             $match: {
             "sourceDocument.model": "wTrack",
             "sourceDocument._id"  : {$in: sourceDocuments},
             credit                : {$gt: 0}
             }
             }, {
             $lookup: {
             from                   : "wTrack",
             localField             : "sourceDocument._id",
             foreignField: "_id", as: "sourceDocument"
             }
             }, {
             $project: {
             date          : 1,
             credit        : {$divide: ['$credit', '$currency.rate']},
             sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
             journal       : 1
             }
             }, {
             $lookup: {
             from                   : "Employees",
             localField             : "sourceDocument.employee",
             foreignField: "_id", as: "employee"
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$arrayElemAt: ["$employee", 0]}
             }
             }, {
             $project: {
             date    : 1,
             credit  : 1,
             journal : 1,
             employee: {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
             }
             }, {
             $sort: {
             date    : 1,
             employee: 1,
             journal : 1
             }
             }, {
             $group: {
             _id     : '$date',
             //entries: {$push: '$$ROOT'},
             totalSum: {$sum: '$credit'}
             }
             }], function (err, result) {
             if (err) {
             cb(err);
             }

             Journal.populate(result, {
             path: 'journal'
             }, function (err, result) {
             cb(null, result);

             });
             });
             };*/

            async.parallel([debit/*, credit*/], function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, {wagesPayable: result[0]/* || [], jobInProgress: result[1] || []*/});
            });
        };

        async.waterfall([wTrackFinder, resultFinder], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    };

    /*this.create = function (body, dbIndex, cb, uId) {
     var Journal = models.get(dbIndex, 'journal', journalSchema);
     var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
     var Currency = models.get(dbIndex, 'currency', CurrencySchema);
     var journalId = body.journal;
     var now = moment();
     var date = body.date ? moment(body.date) : now;
     //var currency = {
     //    name: body.currency
     //};
     var currency;
     var amount = body.amount;
     var rates;

     var waterfallTasks = [currencyNameFinder, journalFinder, journalEntrySave];

     date = date.format('YYYY-MM-DD');

     function currencyNameFinder(waterfallCb) {

     Currency.findById(body.currency, function (err, result) {
     if (err) {
     waterfallCb(err);
     }

     waterfallCb(null, result.name);
     });
     }

     function journalFinder(currencyName, waterfallCb) {
     var err;

     if (!journalId) {
     err = new Error('Journal id is required field');
     err.status = 400;

     return waterfallCb(err);
     }

     currency = {
     name: currencyName
     };

     Journal.findById(journalId, waterfallCb);

     };

     function journalEntrySave(journal, waterfallCb) {
     oxr.historical(date, function () {
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
     date: new Date()
     };

     debitObject.createdBy = {
     user: uId,
     date: new Date()
     };

     journalEntry = new Model(debitObject);
     journalEntry.save(parallelCb);
     },
     creditSaver: function (parallelCb) {
     var journalEntry;

     creditObject.credit = amount;
     creditObject.account = journal.creditAccount;

     creditObject.editedBy = {
     user: uId,
     date: new Date()
     };

     creditObject.createdBy = {
     user: uId,
     date: new Date()
     };

     journalEntry = new Model(creditObject);
     journalEntry.save(parallelCb);
     }
     };

     if (!journal || !journal._id) {
     err = new Error('Invalid Journal');
     err.status = 400;

     return waterfallCb(err);
     }

     rates = oxr.rates;
     currency.rate = rates[currency.name];

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
     });
     };

     async.waterfall(waterfallTasks, function (err, response) {
     if (err) {
     return cb(err);
     }

     cb(null, response);
     });
     };*/

    this.getForView = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        var data = req.query;
        var sort = data.sort ? data.sort : {date: 1};
        var findInvoice;
        var findSalary;
        var findByEmployee;
        var count = parseInt(data.count, 10) || 100;
        var page = parseInt(data.page, 10);
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        access.getReadAccess(req, req.session.uId, 86, function (access) {
            if (access) {
                findInvoice = function (cb) {
                    Model
                        .aggregate([{
                            $match: {
                                "sourceDocument.model": "Invoice",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "account",
                                foreignField: "_id", as: "account"
                            }
                        }, {
                            $lookup: {
                                from                   : "Invoice",
                                localField             : "sourceDocument._id",
                                foreignField: "_id", as: "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from                   : "journals",
                                localField             : "journal",
                                foreignField: "_id", as: "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "journal.debitAccount",
                                foreignField: "_id", as: "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "journal.creditAccount",
                                foreignField: "_id", as: "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from                   : "Customers",
                                localField             : "sourceDocument._id.supplier",
                                foreignField: "_id", as: "sourceDocument.subject"
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                currency                : 1,
                                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'journal.name'          : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.name'   : '$sourceDocument._id.name',
                                'sourceDocument.model'  : 1,
                                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument.subject", 0]},
                                account                 : 1
                            }
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
                        }], function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            cb(null, result);
                        });
                };

                findSalary = function (cb) {
                    var query = Model
                        .aggregate([{
                            $match: {
                                "sourceDocument.model": "wTrack",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "account",
                                foreignField: "_id", as: "account"
                            }
                        }, {
                            $lookup: {
                                from                   : "wTrack",
                                localField             : "sourceDocument._id",
                                foreignField: "_id", as: "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from                   : "journals",
                                localField             : "journal",
                                foreignField: "_id", as: "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from                   : "jobs",
                                localField             : "sourceDocument._id.jobs",
                                foreignField: "_id", as: "sourceDocument._id.jobs"
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "journal.debitAccount",
                                foreignField: "_id", as: "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "journal.creditAccount",
                                foreignField: "_id", as: "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from                   : "Employees",
                                localField             : "sourceDocument._id.employee",
                                foreignField: "_id", as: "sourceDocument._id.employee"
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                currency                : 1,
                                'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'journal.name'          : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.model'  : 1,
                                'sourceDocument.jobs'   : {$arrayElemAt: ["$sourceDocument._id.jobs", 0]},
                                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument._id.employee", 0]},
                                'sourceDocument.name'   : '$sourceDocument._id.jobs.name',
                                account                 : 1
                            }
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
                        }]);

                    query.options = {allowDiskUse: true};

                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        cb(null, result);
                    });
                };

                findByEmployee = function (cb) {
                    var query = Model
                        .aggregate([{
                            $match: {
                                "sourceDocument.model": "Employees",
                                debit                 : {$gt: 0}
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "account",
                                foreignField: "_id", as: "account"
                            }
                        }, {
                            $lookup: {
                                from                   : "Employees",
                                localField             : "sourceDocument._id",
                                foreignField: "_id", as: "sourceDocument._id"
                            }
                        }, {
                            $lookup: {
                                from                   : "journals",
                                localField             : "journal",
                                foreignField: "_id", as: "journal"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                currency              : 1,
                                journal               : {$arrayElemAt: ["$journal", 0]},
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "journal.debitAccount",
                                foreignField: "_id", as: "journal.debitAccount"
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "journal.creditAccount",
                                foreignField: "_id", as: "journal.creditAccount"
                            }
                        }, {
                            $lookup: {
                                from                   : "Department",
                                localField             : "sourceDocument._id.department",
                                foreignField: "_id", as: "sourceDocument._id.department"
                            }
                        }, {
                            $project: {
                                debit                          : 1,
                                currency                       : 1,
                                'journal.debitAccount'         : {$arrayElemAt: ["$journal.debitAccount", 0]},
                                'journal.creditAccount'        : {$arrayElemAt: ["$journal.creditAccount", 0]},
                                'sourceDocument._id.department': {$arrayElemAt: ["$sourceDocument._id.department", 0]},
                                'journal.name'                 : 1,
                                date                           : 1,
                                'sourceDocument.model'         : 1,
                                'sourceDocument.subject'       : '$sourceDocument._id',
                                account                        : 1
                            }
                        }, {
                            $project: {
                                debit                          : 1,
                                currency                       : 1,
                                'journal.debitAccount'         : 1,
                                'journal.creditAccount'        : 1,
                                'sourceDocument._id.department': 1,
                                'journal.name'                 : 1,
                                date                           : 1,
                                'sourceDocument.model'         : 1,
                                'sourceDocument.subject'       : 1,
                                'sourceDocument.name'          : '$sourceDocument._id.department.departmentName',
                                account                        : 1
                            }
                        }, {
                            $sort: sort
                        }, {
                            $skip: skip
                        }, {
                            $limit: count
                        }]);

                    query.options = {allowDiskUse: true};

                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        cb(null, result);
                    });
                };

                var parallelTasks = [findInvoice, findSalary, findByEmployee];

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    var invoices = result[0];
                    var salary = result[1];
                    var salaryEmployee = result[2];
                    var models = invoices.concat(salary);

                    res.status(200).send(models.concat(salaryEmployee));
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.removeByDocId = function (docId, dbIndex, callback) {
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        Model
            .remove({'sourceDocument._id': docId}, callback);
    };
};

module.exports = Module;
