var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas['journal'];
var journalEntrySchema = mongoose.Schemas['journalEntry'];
var CurrencySchema = mongoose.Schemas.Currency;
var MonthHoursSchema = mongoose.Schemas.monthHours;
var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;
var jobsSchema = mongoose.Schemas.jobs;

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

    this.reconcile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var body = req.body;
        var date = new Date(body.date);
        //var dateKey = moment(date).year() * 100 + moment(date).isoWeek();
        //var dateKeyNext = (moment(date).year() + 1) * 100 + moment(date).isoWeek();
        var dateKey = 201501;
        var dateKeyNext = 201520;

        Job.find({reconcile: true}, function (err, jobs) {
            var jobsArray = [];

            jobs.forEach(function (el) {
                jobsArray.push(el._id);
            });

            WTrack.find({jobs: {$in: jobsArray}}, function (err, result) {
                if (err) {
                    return next(err);
                }
                var resultArray = [];

                result.forEach(function (el) {
                    resultArray.push(el._id);
                });

                var parallelRemove = function (cb) {
                    Model.remove({
                        "sourceDocument.model": "wTrack",
                        "sourceDocument._id"  : {$in: resultArray},
                        date                  : {$gte: date}
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

                            for (var i = 7; i >= 1; i--) {
                                var day = i;
                                var hours = wTrackResult[i];
                                var date = moment([wTrackResult.year, wTrackResult.month]).isoWeek(wTrackResult.week).day(day);

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
                                    var query = monthHours.find({
                                        month: wTrackResult.month,
                                        year : wTrackResult.year
                                    }).lean();

                                    query.exec(function (err, element) {
                                        if (err) {
                                            return cb(err);
                                        }

                                        pcb(null, element[0] ? element[0].hours : 0);
                                    });
                                };

                                async.parallel([salaryFinder, monthHoursFinder], function (err, result) {
                                    if (err) {
                                        return asyncCb(err);
                                    }
                                    var hoursInMonth = result[1];
                                    var salary = result[0];

                                    var costHour = isFinite(salary / hoursInMonth) ? salary / hoursInMonth : 0;

                                    var body = {
                                        currency      : '565eab29aeb95fa9c0f9df2d',
                                        journal       : '56c41876a2cb3024468a04db',
                                        cost          : costHour * hours * 100,
                                        date          : date,
                                        sourceDocument: {
                                            model: 'jobs',
                                            _id  : wTrackResult.jobs
                                        }
                                    };

                                    var superCb = function () {
                                        counter++;

                                        if (counter === 7) {
                                            asyncCb();
                                        }
                                    };

                                    createReconciled(body, req.session.lastDb, superCb, req.session.uId)
                                });
                            }
                            ;
                        });
                    }, function (err, result) {
                        cb();
                    });
                };

                var parallelTasks = [parallelRemove, parallelCreate];

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: true});

                    WTrack.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function () {

                    });
                    var db = models.connection(req.session.lastDb);

                    db.collection('settings').findOneAndUpdate({name: 'reconcileDate'}, {$set: {date: date}}, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                    });
                });
            });

        });
    };

    function createReconciled(body, dbIndex, cb, uId) {
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
        var Currency = models.get(dbIndex, 'currency', CurrencySchema);
        var journalId = body.journal;
        var now = moment();
        var date = body.date ? moment(body.date) : now;
        var currency;
        var amount = body.cost;
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
    };

    this.getForView = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Journal = models.get(dbIndex, 'journal', journalSchema);
        var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);

        var data = req.query;
        var sort = data.sort ? data.sort : {_id: 1};
        var findInvoice;
        var findSalary;

        access.getReadAccess(req, req.session.uId, 86, function (access) {
            if (access) {
                findInvoice = function (cb) {
                    Model
                        .aggregate([{
                            $match: {
                                "sourceDocument.model": "Invoice"
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
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                credit                : {$divide: ['$credit', '$currency.rate']},
                                currency              : 1,
                                journal               : 1,
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                date                  : 1
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
                                credit                  : 1,
                                currency                : 1,
                                journal                 : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.name'   : '$sourceDocument._id.name',
                                'sourceDocument.model'  : 1,
                                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument.subject", 0]},
                                account                 : 1
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                credit                  : 1,
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
                        }], function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            Journal.populate(result, {
                                path  : 'journal',
                                select: '_id name'
                            }, function (err, journals) {
                                if (err) {
                                    return cb(err);
                                }

                                cb(null, result);
                            });
                        });
                };

                findSalary = function (cb) {
                    Model
                        .aggregate([{
                            $match: {
                                "sourceDocument.model": "jobs"
                            }
                        }, {
                            $lookup: {
                                from                   : "chartOfAccount",
                                localField             : "account",
                                foreignField: "_id", as: "account"
                            }
                        }, {
                            $lookup: {
                                from                   : "jobs",
                                localField             : "sourceDocument._id",
                                foreignField: "_id", as: "sourceDocument._id"
                            }
                        }, {
                            $project: {
                                debit                 : {$divide: ['$debit', '$currency.rate']},
                                credit                : {$divide: ['$credit', '$currency.rate']},
                                currency              : 1,
                                journal               : 1,
                                account               : {$arrayElemAt: ["$account", 0]},
                                'sourceDocument._id'  : {$arrayElemAt: ["$sourceDocument._id", 0]},
                                'sourceDocument.model': 1,
                                'sourceDocument.name' : '$sourceDocument._id.name',
                                date                  : 1
                            }
                        }, {
                            $lookup: {
                                from                   : "Project",
                                localField             : "sourceDocument._id.project",
                                foreignField: "_id", as: "sourceDocument._id.project"
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                credit                  : 1,
                                currency                : 1,
                                journal                 : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.name'   : 1,
                                'sourceDocument.model'  : 1,
                                'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument._id.project", 0]},
                                account                 : 1
                            }
                        }, {
                            $project: {
                                debit                   : 1,
                                credit                  : 1,
                                currency                : 1,
                                journal                 : 1,
                                date                    : 1,
                                'sourceDocument._id'    : 1,
                                'sourceDocument.name'   : 1,
                                'sourceDocument.model'  : 1,
                                'sourceDocument.subject': 1,
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
                        }], function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            Journal.populate(result, {
                                path  : 'journal',
                                select: '_id name'
                            }, function (err, journals) {
                                if (err) {
                                    return cb(err);
                                }

                                cb(null, result);
                            });
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
