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
        //var dateKey = moment(date).year() * 100 + moment(date).isoWeek();
        //var dateKeyNext = (moment(date).year() + 1) * 100 + moment(date).isoWeek();
        var dateKey = 201501;
        var dateKeyNext = 201520;
        var reconcileSalaryEntries;
        var reconcileInvoiceEntries;
        var timeToSet = {hour: 18, minute: 1, second: 0};

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
                                    redisStore.readFromStorage('monthHours', key, function(err, result){
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
                                        year: wTrackResult.year,
                                        month: wTrackResult.month,
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

                                        if (vacation && vacation.vacations && vacation.vacations[wTrackResult.dateByWeek]){
                                            vacArray = vacation.vacArray;
                                            newDate = moment().isoWeekYear(vacation.year).month(vacation.month - 1).date(1);

                                            for(var i = vacArray.length - 1; i >= 0; i--){
                                                if (vacArray[i]){
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
                                        journal       : '56cc72a8541812c07197356e',
                                        date          : moment(date).set(timeToSet),
                                        sourceDocument: {
                                            model: 'wTrack',
                                            _id  : wTrackResult._id
                                        }
                                    };

                                    if (day <= 5 && !sameDate) {
                                        if (hours - 8 >= 0) {
                                            body.amount = costHour * 8 * 100;
                                            bodyIdle.amount = 0;
                                            bodyOvertime.amount = costHour * (hours - 8) * 100;
                                        } else {
                                            body.amount = costHour * hours * 100;
                                            bodyIdle.amount = idleCoefficient * (8 - hours) * 100;
                                            bodyOvertime.amount = 0;
                                        }

                                        if (vacationSameDate){
                                            if (vacation[dateKey] === "V" || "S"){
                                                bodyOvertime.amount = costHour * hours * 100;
                                            }
                                        }

                                        bodyVacation.amount = vacationCoefficient * 8 * 100;
                                        bodyAdminCosts.amount = adminCoefficient * hours * 100;
                                        bodyHoliday.amount = 0;
                                    } else {
                                        bodyOvertime.amount = costHour * hours * 100;
                                        bodyAdminCosts.amount = adminCoefficient * hours * 100;
                                        bodyHoliday.amount = 0;

                                        if (sameDate) {
                                            bodyHoliday.amount = costHour * 8 * 100;
                                        }
                                    }

                                    var superCb = function () {
                                        counter++;

                                        if (counter === 42) {
                                            asyncCb();
                                        }
                                    };

                                    createReconciled(body, req.session.lastDb, superCb, req.session.uId, timeToSet);
                                    createReconciled(bodyIdle, req.session.lastDb, superCb, req.session.uId, timeToSet);
                                    createReconciled(bodyOvertime, req.session.lastDb, superCb, req.session.uId, timeToSet);
                                    createReconciled(bodyVacation, req.session.lastDb, superCb, req.session.uId, timeToSet);
                                    createReconciled(bodyAdminCosts, req.session.lastDb, superCb, req.session.uId, timeToSet);
                                    createReconciled(bodyHoliday, req.session.lastDb, superCb, req.session.uId, timeToSet);
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
    };

    function createReconciled(body, dbIndex, cb, uId, timeToSet) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var Currency = models.get(dbIndex, 'currency', CurrencySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.amount;
        var rates;
        var hours = body.hours;
        var timeToSet = timeToSet;

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

                        if (timeToSet && hours && (8 - hours > 0)) {
                            (debitObject.createdBy.date).set(timeToSet);
                            (debitObject.editedBy.date).set(timeToSet);
                        }

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

                        if (timeToSet && hours && (8 - hours > 0)) {
                            (debitObject.createdBy.date).set(timeToSet);
                            (debitObject.editedBy.date).set(timeToSet);
                        }

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
        createReconciled(body, dbIndex, cb, uId);
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

    this.getForReport = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
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
                        $lookup: {
                            from                   : "wTrack",
                            localField             : "sourceDocument._id",
                            foreignField: "_id", as: "sourceDocument"
                        }
                    }, {
                        $project: {
                            date          : 1,
                            debit         : {$divide: ['$debit', '$currency.rate']},
                            sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]}
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
                            debit   : 1,
                            employee: {$arrayElemAt: ["$employee", 0]}
                        }
                    }, {
                        $project: {
                            date    : 1,
                            debit   : 1,
                            employee: {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
                        }
                    }, {
                        $sort: {
                            date    : 1,
                            employee: 1
                        }
                    }], function (err, result) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, result);
                    });
            };

            credit = function (cb) {
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
                            sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]}
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
                            employee: {$arrayElemAt: ["$employee", 0]}
                        }
                    }, {
                        $project: {
                            date    : 1,
                            credit  : 1,
                            employee: {$concat: ['$employee.name.first', ' ', '$employee.name.last']}
                        }
                    }, {
                        $sort: {
                            date    : 1,
                            employee: 1
                        }
                    }], function (err, result) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, result);
                    });
            };

            async.parallel([debit, credit], function (err, result) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, {wagesPayable: result[0] || [], jobInProgress: result[1] || []});
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
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        var data = req.query;
        var sort = data.sort ? data.sort : {date: 1};
        var findInvoice;
        var findSalary;
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
                        },/* {
                            $match: {
                                'account.accountType': "Credit"
                            }
                        },*/ {
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
                            $skip: skip
                        }, {
                            $limit: count
                        }/*, {
                         $project: {
                         debit                   : 1,
                         currency                : 1,
                         journal                 : 1,
                         date                    : 1,
                         'sourceDocument._id'    : 1,
                         'sourceDocument.name'   : 1,
                         'sourceDocument.subject': 1,
                         'sourceDocument.model'  : 1,
                         account                 : 1
                         }
                         }, {
                         $group: {
                         _id           : '$sourceDocument._id._id',
                         debit         : {$sum: "$debit"},
                         credit        : {$sum: "$credit"},
                         currency      : {$addToSet: '$currency'},
                         journal       : {$addToSet: '$journal'},
                         date          : {$addToSet: '$date'},
                         sourceDocument: {$addToSet: '$sourceDocument'},
                         account       : {$addToSet: '$account'}
                         }
                         }, {
                         $project: {
                         _id           : 1,
                         debit         : 1,
                         credit        : 1,
                         account       : 1,
                         currency      : {$arrayElemAt: ["$currency", 0]},
                         date          : {$arrayElemAt: ["$date", 0]},
                         sourceDocument: {$arrayElemAt: ["$sourceDocument", 0]},
                         journal       : {$arrayElemAt: ["$journal", 0]}
                         }
                         }*/], function (err, result) {
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
                              //  "sourceDocument._id"  : objectId("56c6d5654a4805fc2c2149db"),
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
                            $match: {
                                'account.accountType': "Debit"
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

                var parallelTasks = [findInvoice, findSalary];

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    var invoices = result[0];
                    var salary = result[1];
                    var models = invoices.concat(salary);

                    res.status(200).send(models);
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
