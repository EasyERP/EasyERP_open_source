var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas.journal;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var manualEntrySchema = mongoose.Schemas.manualEntry;
var CurrencySchema = mongoose.Schemas.Currency;
var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;
var jobsSchema = mongoose.Schemas.jobs;
var invoiceSchema = mongoose.Schemas.Invoices;
var holidaysSchema = mongoose.Schemas.Holiday;
var vacationSchema = mongoose.Schemas.Vacation;
var PaymentMethodSchema = mongoose.Schemas.PaymentMethod;
var cashTransferSchema = mongoose.Schemas.cashTransfer;
var orgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
var InvoicePaymentSchema = mongoose.Schemas.InvoicePayment;
var ProductSchema = mongoose.Schemas.Products;
var objectId = mongoose.Types.ObjectId;

var LIABILITIES = objectId('584e47953d2d06b40d2e9dc0');
var EQUITY = objectId('5810c75b2b225158086d7f7f');
var INVENTORY = objectId('5810c75b2b225158086d7f87');
var CURRENT_ASSETS = objectId('5810c75b2b225158086d7f80');
var BANK_CASH = objectId('57ed155af9afdd682a304f8a');
var FIXED_ASSETS = objectId('57ed155af9afdd682a304f8b');
var DIVIDEND_INVOICE = objectId('572347d78ba4fd1330062726');

// var oxr = require('open-exchange-rates');
var _ = require('underscore');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');
var pageHelper = require('../helpers/pageHelper');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var ratesRetriever = require('../helpers/ratesRetriever')();

var journalEntryCT = 'journalEntry';

var Module = function (models, event) {
        'use strict';
        // ToDo set it to process.env

        var JournalEntryService = require('../services/journalEntry')(models);
        var JournalService = require('../services/journal')(models);
        var GoodsInNotesService = require('../services/goodsInNotes')(models);
        var ratesService = require('../services/rates')(models);
        var currencyRatesHelper = require('../helpers/currencyRates')(models);
        var OrganizationService = require('../services/organizationSetting')(models);
        var currencyService = require('../services/currency')(models);

        var CONSTANTS = require('../constants/mainConstants.js');
        var matchObject = {};
        var notDevArray = CONSTANTS.NOT_DEV_ARRAY;

        var exporter = require('../helpers/exporter/exportDecorator');
        var exportMap = require('../helpers/csvMap').journalEntry;

        matchObject[CONSTANTS.PRODUCT_SALES] = 'credit';
        matchObject[CONSTANTS.COGS] = 'debit';

        function createReconciled(body, opt) {
            var journalFinder;
            var journalEntrySave;
            var waterfallTasks;
            var currency = body.currency;
            var amount = body.amount;
            var date = body.date;
            var cb;
            var ratesFinder;
            var fx = {};

            if (typeof opt.cb === 'function') {
                cb = opt.cb;
            } else {
                cb = function () {
                    return false;
                };
            }

            ratesFinder = function (callback) {
                ratesService.getById({dbName: opt.dbName, id: date}, callback);
            };

            journalFinder = function (ratesObject, callback) {
                var optionsObject = {};

                fx.base = ratesObject && ratesObject.base ? ratesObject.base : 'USD';
                fx.rates = ratesObject && ratesObject.rates ? ratesObject.rates : {};

                optionsObject.journal = body.journal;
                optionsObject.dbName = opt.dbName;

                JournalService.journalFinder(optionsObject, callback);
            };

            journalEntrySave = function (journal, callback) {
                var optionsObject = _.extend({}, body);

                optionsObject.journal = journal || {debitAccount: body.debitAccount, creditAccount: body.creditAccount};
                optionsObject.currency = currency;
                optionsObject.amount = amount;
                optionsObject.date = date;
                optionsObject.uId = opt.uId;
                optionsObject.dbName = opt.dbName;

                if (currency.length === 3) {
                    optionsObject.currency = {
                        _id: currency
                    };
                }

                if (optionsObject.currency && optionsObject.currency._id) {
                    optionsObject.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, optionsObject.currency._id);
                }

                JournalEntryService.journalEntrySaver(optionsObject, callback);
            };

            waterfallTasks = [ratesFinder, journalFinder, journalEntrySave];

            async.waterfall(waterfallTasks, function (err, response) {
                if (err) {
                    return cb(err);
                }

                if (cb) {
                    cb(null, response);
                }
            });
        }

        this.createReconciled = function (body, opt) {
            createReconciled(body, opt);
        };

        function createMultiRows(body, opt) {
            var journalFinder;
            var getRates;
            var createMultiRows;
            var currencyId = body.currency && body.currency._id ? body.currency._id : body.currency;
            var date = moment(new Date(body.date));
            var cb;
            var rates;
            var waterfallTasks;
            var fx = {};
            var currency;

            date = date.format('YYYY-MM-DD');

            if (typeof opt.cb === 'function') {
                cb = opt.cb;
            } else {
                cb = function () {
                    return false;
                };
            }

            getRates = function (waterfallCb) {
                ratesService.getById({id: date, dbName: opt.dbName}, function (err, result) {
                    fx.rates = result && result.rates ? result.rates : {};
                    fx.base = result && result.base ? result.base : 'USD';
                    waterfallCb();
                });
            };

            journalFinder = function (callback) {
                var optionsObject = {};

                optionsObject.journal = body.journal;
                optionsObject.dbName = opt.dbName;

                if (!body.journal) {
                    optionsObject.debitAccount = body.debitAccount;
                    optionsObject.creditAccount = body.creditAccount;
                    JournalService.journalFinderByAccounts(optionsObject, callback);
                } else {
                    JournalService.journalFinder(optionsObject, callback);
                }

            };

            createMultiRows = function (journal, callback) {
                var optionsObject = _.extend({}, body);

                currency = {
                    _id : currencyId,
                    rate: ratesRetriever.getRate(fx.rates, fx.base, currencyId)
                };

                optionsObject.journal = journal;
                optionsObject.currency = currency;
                optionsObject.date = body.date;
                optionsObject.uId = opt.uId;
                optionsObject.dbName = opt.dbName;
                optionsObject.notDivideRate = opt.notDivideRate;

                JournalEntryService.createMultiRows(optionsObject, callback);
            };

            waterfallTasks = [getRates, journalFinder, createMultiRows];

            async.waterfall(waterfallTasks, function (err, response) {
                if (err) {
                    return cb(err);
                }

                if (cb) {
                    cb(null, response);
                }
            });
        }

        this.createMultiRows = function (body, opt) {
            createMultiRows(body, opt);
        };

        this.createManual = function (req, res, next) {
            var dbIndex = req.session.lastDb;
            var uId = req.session.uId;
            var Journal = models.get(dbIndex, 'journal', journalSchema);
            var Model = models.get(dbIndex, 'manualEntry', manualEntrySchema);
            var Currency = models.get(dbIndex, 'currency', CurrencySchema);
            var body = req.body;
            var now = moment();
            var date = body.date ? moment(new Date(body.date)) : now;
            var currency = body.currency;
            var rates;
            var waterfallTasks;
            var journalId = body.journal;
            var accountArray = body.accountsItems;
            var timeStamp = new Date();
            var timeStampDate = new Date(date);
            var fx = {};

            timeStamp = timeStamp.valueOf() + timeStampDate.valueOf();

            delete body.accountsItems;

            body.date = new Date(body.date);

            date = date.format('YYYY-MM-DD');

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
                var object;

                if (!journal || !journal._id) {
                    err = new Error('Invalid Journal');
                    err.status = 400;

                    return waterfallCb(err);
                }

                currency = {
                    _id : currency._id,
                    rate: ratesRetriever.getRate(fx.rates, fx.base, currency.name)
                };

                body.currency = currency;
                body.journal = journal._id;
                body.timestamp = timeStamp;

                object = _.extend({}, body);

                async.each(accountArray, function (el, cb) {
                    var journalEntry;

                    object.debit = el.debit;
                    object.credit = el.credit;
                    object.account = el.account;

                    object.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    object.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    object.debitFC = el.debitFC;
                    object.creditFC = el.creditFC;

                    if (object.debitFC === object.debit) {
                        object.debitFC = 0;
                    }

                    if (object.creditFC === object.credit) {
                        object.creditFC = 0;
                    }

                    if (el.debit || el.credit && moment(object.date).isBefore(now)) {
                        journalEntry = new Model(object);
                        journalEntry.save(cb);
                    } else {
                        cb();
                    }
                }, function (err) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, {success: true});
                });
            }

            function getRates(waterfallCb) {
                ratesService.getById({id: date, dbName: dbIndex}, function (err, result) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    fx.rates = result && result.rates ? result.rates : {};
                    fx.base = result && result.base ? result.base : {};
                    waterfallCb();
                });
            }

            waterfallTasks = [getRates, journalFinder, journalEntrySave];

            async.waterfall(waterfallTasks, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });
        };

        function totalCollectionLength(req, mainCallback) {
            var dbIndex = req.session.lastDb;
            var Model = models.get(dbIndex, journalEntryCT, journalEntrySchema);
            var data = req.query;
            var filter = data.filter || {};
            var aggregate;
            var matchFilter;
            var matchWithoutState;

            if (filter.hasOwnProperty('sum')) {
                filter.debit = {
                    key  : 'debit',
                    value: filter.sum.value,
                    type : 'integer'
                };

                filter.credit = {
                    key  : 'credit',
                    value: filter.sum.value,
                    type : 'integer'
                };

                delete filter.sum;
            }

            matchFilter = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            matchWithoutState = filterMapper.mapFilter(filter, {
                contentType : journalEntryCT,
                keysArray   : ['date'],
                withoutState: true
            });

            if (matchWithoutState.debit && matchWithoutState.credit) {
                matchWithoutState.$or = [{debit: matchWithoutState.debit}, {credit: matchWithoutState.credit}];

                delete matchWithoutState.debit;
                delete matchWithoutState.credit;

                if (matchWithoutState.timestamp) {
                    matchWithoutState.timestamp = matchWithoutState.timestamp;

                    delete matchWithoutState.$or;
                }

            }

            aggregate = Model.aggregate([{
                $match: matchFilter
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    journal       : {$arrayElemAt: ['$journal', 0]},
                    account       : {$arrayElemAt: ['$account', 0]},
                    sourceDocument: 1,
                    debit         : 1,
                    credit        : 1,
                    date          : 1,
                    timestamp     : 1,
                    _type         : 1
                }
            }, {
                $project: {
                    'account._id' : 1,
                    'account.name': 1,
                    'journal.name': '$journal.name',
                    'journal._id' : '$journal._id',
                    sourceDocument: 1,
                    debit         : 1,
                    credit        : 1,
                    currency      : 1,
                    date          : 1,
                    timestamp     : 1,
                    _type         : 1
                }
            }, {
                $match: matchWithoutState
            }]);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                var totalDebit = 0;
                var totalCredit = 0;

                if (err) {
                    return mainCallback(err);
                }

                result.forEach(function (model) {
                    totalDebit += model.debit;
                    totalCredit += model.credit;
                });

                mainCallback(null, {total: result.length, totalDebit: totalDebit, totalCredit: totalCredit});
            });
        }

        var lookupArray = [{
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'account',
                foreignField: '_id',
                as          : 'account'
            }
        }, {
            $lookup: {
                from        : 'journals',
                localField  : 'journal',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $lookup: {
                from        : 'currency',
                localField  : 'currency._id',
                foreignField: '_id',
                as          : 'currency._id'
            }
        }, {
            $project: {
                journal        : {$arrayElemAt: ['$journal', 0]},
                account        : {$arrayElemAt: ['$account', 0]},
                'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                sourceDocument : 1,
                'currency.name': 1,
                debit          : {$divide: ['$debit', 100]},
                credit         : {$divide: ['$credit', 100]},
                debitFC        : 1,
                creditFC       : 1,
                date           : 1,
                timestamp      : 1,
                createdBy      : 1,
                _type          : 1
            }
        }, {
            $project: {
                'account._id' : 1,
                'account.name': 1,
                'journal.name': '$journal.name',
                'journal._id' : '$journal._id',
                sourceDocument: 1,
                currency      : 1,
                debit         : 1,
                credit        : 1,
                debitFC       : 1,
                creditFC      : 1,
                date          : 1,
                timestamp     : 1,
                createdBy     : 1,
                _type         : 1
            }
        }];

        this.exportToXlsx = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
            var options;

            options = {
                res         : res,
                next        : next,
                Model       : Model,
                map         : exportMap,
                returnResult: true,
                fileName    : journalEntryCT
            };

            function lookupFunc(cb) {
                var query = [];
                var i;

                query.push({
                    $match: filterMapper.mapFilter(filter, {
                        contentType: journalEntryCT,
                        keysArray  : ['date']
                    })
                });

                for (i = 0; i < lookupArray.length; i++) {
                    query.push(lookupArray[i]);
                }

                query.push({
                    $match: filterMapper.mapFilter(filter, {
                        contentType : journalEntryCT,
                        keysArray   : ['date'],
                        withoutState: true
                    })
                });

                options.query = query;
                options.cb = cb;

                exporter.exportToXlsx(options);
            }

            async.parallel([lookupFunc], function (err, result) {
                var resultArray = result[0];

                exporter.exportToXlsx({
                    res        : res,
                    next       : next,
                    Model      : Model,
                    resultArray: resultArray,
                    map        : exportMap,
                    fileName   : journalEntryCT
                });
            });
        };

        this.exportToCsv = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
            var options;

            options = {
                res         : res,
                next        : next,
                Model       : Model,
                map         : exportMap,
                returnResult: true,
                fileName    : journalEntryCT
            };

            function lookupFunc(cb) {
                var query = [];
                var i;

                query.push({
                    $match: filterMapper.mapFilter(filter, {
                        contentType: journalEntryCT,
                        keysArray  : ['date']
                    })
                });

                for (i = 0; i < lookupArray.length; i++) {
                    query.push(lookupArray[i]);
                }

                query.push({
                    $match: filterMapper.mapFilter(filter, {
                        contentType : journalEntryCT,
                        keysArray   : ['date'],
                        withoutState: true
                    })
                });

                options.query = query;
                options.cb = cb;

                exporter.exportToXlsx(options);
            }

            async.parallel([lookupFunc], function (err, result) {
                var resultArray = result[0];

                exporter.exportToCsv({
                    res        : res,
                    next       : next,
                    Model      : Model,
                    resultArray: resultArray,
                    map        : exportMap,
                    fileName   : journalEntryCT
                });
            });
        };

        function setReconcileDate(req, date) {
            var db = models.connection(req.session.lastDb);
            db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
                var dateResult;
                var newDae;
                var newReconcileDate;
                var lessDate;

                if (err) {
                    return console.log(err);
                }

                dateResult = result ? result.date : new Date();
                newDae = moment(date);
                newReconcileDate = moment(dateResult);
                lessDate = newDae.isBefore(newReconcileDate) ? true : false;

                if (lessDate) {
                    db.collection('settings').update({name: 'reconcileDate'}, {$set: {date: new Date(newDae)}}, {upsert: true}, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                    });
                }
            });
        }

        this.setReconcileDate = function (req, date) {
            setReconcileDate(req, date);
        };

        this.removeBySourceDocument = function (req, sourceId) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);

            Model.find({'sourceDocument._id': sourceId}, function (err, result) {
                var ids = [];

                if (err) {
                    return console.log(err);
                }

                result.forEach(function (el) {
                    setReconcileDate(req, el.date);
                    ids.push(el._id);
                });

                Model.remove({_id: {$in: ids}}, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        };

        this.createIdleByMonth = function (options) {
            var req = options.req;
            var callback = options.callback;
            var month = options.month;
            var year = options.year;
            var Holidays = models.get(req.session.lastDb, 'Holiday', holidaysSchema);
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
            var Vacation = models.get(req.session.lastDb, 'Vacation', vacationSchema);
            var startDate = moment(new Date()).year(year).month(month - 1).startOf('month');
            var endDate = moment(new Date()).year(year).month(month - 1).endOf('month');
            var parallelFuncs;
            var waterfallFuncs;
            var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
            var date = moment(endDate).set({
                hour       : 20,
                minute     : 0,
                second     : 0,
                millisecond: 0
            });
            var dateByMonth = year * 100 + month;

            function parallelFuncFind(wfCb) {

                function findHolidays(pCb) {
                    var query = Holidays.find({dateByMonth: year * 100 + month}).lean();

                    query.exec(function (err, result) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, result);
                    });
                }

                function findAllDevs(pCb) {
                    var query = {
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
                                            $gte: new Date(startDate)
                                        }
                                    }, {
                                        lastHire: {
                                            $ne : null,
                                            $lte: new Date(endDate)
                                        }
                                    }]
                                }]
                            }, {
                                $and: [{
                                    isEmployee: false
                                }, {
                                    lastFire: {
                                        $ne : null,
                                        $gte: new Date(startDate)
                                    }
                                }]
                            }
                            ]
                        }]
                    };

                    Employee.aggregate([{
                        $match: {
                            // 'department': {$nin: notDevArray},
                            hire: {$ne: []}
                        }
                    }, {
                        $lookup: {
                            from        : 'transfers',
                            localField  : '_id',
                            foreignField: 'employee',
                            as          : 'transfer'
                        }
                    }, {
                        $project: {
                            isEmployee: 1,
                            department: 1,
                            fire      : 1,
                            transfer  : 1,
                            hire      : 1,
                            lastFire  : 1,
                            name      : {$concat: ['$name.first', ' ', '$name.last']},
                            lastHire  : {
                                $let: {
                                    vars: {
                                        lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                                    },

                                    in: {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                                }
                            }
                        }
                    }, {
                        $project: {
                            _id     : 1,
                            transfer: 1,
                            hire    : 1,
                            fire    : 1,
                            name    : 1
                        }
                    }, {
                        $unwind: '$transfer'
                    }, {
                        $lookup: {
                            from        : 'weeklySchedulers',
                            localField  : 'transfer.weeklyScheduler',
                            foreignField: '_id',
                            as          : 'transfer.weeklyScheduler'
                        }
                    }, {
                        $project: {
                            'transfer.weeklyScheduler': {$arrayElemAt: ['$transfer.weeklyScheduler', 0]},
                            'transfer.date'           : 1,
                            'transfer.salary'         : 1,
                            'transfer.department'     : 1,
                            'transfer.status'         : 1,
                            name                      : 1,
                            hire                      : 1,
                            fire                      : 1
                        }
                    }, {
                        $group: {
                            _id     : '$_id',
                            transfer: {$addToSet: '$transfer'},
                            hire    : {$addToSet: '$hire'},
                            fire    : {$addToSet: '$fire'},
                            name    : {$first: '$name'}
                        }
                    }, {
                        $lookup: {
                            from        : 'Vacation',
                            localField  : '_id',
                            foreignField: 'employee',
                            as          : 'vacations'
                        }
                    }, {
                        $project: {
                            vacations: 1,
                            transfer : 1,
                            name     : 1,
                            hire     : {$arrayElemAt: ['$hire', 0]},
                            fire     : {$arrayElemAt: ['$fire', 0]}
                        }
                    }], function (err, employees) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, employees);
                    });

                }

                function findOrdinaryWorked(pCb) {
                    wTrack.aggregate([{
                        $match: {
                            month: month,
                            year : year,
                            _type: 'ordinary'
                        }
                    }, {
                        $project: {
                            employee   : 1,
                            worked     : 1,
                            dateByMonth: {$add: [{$multiply: ['$year', 100]}, '$month']}
                        }
                    }, {
                        $group: {
                            _id        : '$employee',
                            worked     : {$sum: '$worked'},
                            dateByMonth: {$addToSet: '$dateByMonth'}
                        }
                    }, {
                        $project: {
                            dateByMonth: {$arrayElemAt: ['$dateByMonth', 0]},
                            worked     : 1
                        }
                    }], function (err, result) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, result);
                    });
                }

                function removeIdleAndVacation(pCb) {
                    Model.remove({
                        journal: {$in: [objectId(CONSTANTS.VACATION_PAYABLE), objectId(CONSTANTS.IDLE_PAYABLE)]},
                        date   : {$gte: new Date(startDate), $lte: new Date(endDate)}
                    }, function (err, result) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, result);
                    });
                }

                parallelFuncs = [findHolidays, findAllDevs, findOrdinaryWorked, removeIdleAndVacation];

                async.parallel(parallelFuncs, function (err, result) {
                    if (err) {
                        return wfCb(err);
                    }

                    wfCb(null, {holidays: result[0], employees: result[1], employeeWorked: result[2]});
                });
            }

            function forEachEmployee(result, wfCb) {
                var holidays = result.holidays;
                var employeeWorked = result.employeeWorked;
                var employees = result.employees;

                async.each(employees, function (empObject, asyncCb) {
                    var employeeId = empObject._id;
                    var transfer = empObject.transfer;
                    var hire = empObject.hire;
                    var fire = empObject.fire;
                    var salaryForDate = 0;
                    var hoursInMonth = 0;
                    var weeklyScheduler = {};
                    var hoursToRemove = 0;
                    var costForHour;
                    var checkDate;
                    var vacationObject;
                    var transferLength = empObject.transfer.length;
                    var vacationDate;
                    var dayOfWeek;
                    var vacationHours = 0;
                    var vacationCost = 0;
                    var employeeWorkedObject = _.find(employeeWorked, function (el) {
                        return el._id.toString() === employeeId.toString();
                    });
                    var vacations = empObject && empObject.vacations ? empObject.vacations : [];
                    var localEndDate = moment(endDate).date();
                    var localStartKey = 1;
                    var i;
                    var department = '';
                    var vacationBody = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.VACATION_PAYABLE,
                        date          : new Date(date),
                        sourceDocument: {
                            model: 'Employees',
                            _id  : employeeId,
                            name : empObject.name
                        },

                        amount: 0
                    };

                    var cb = _.after(2, asyncCb);

                    var salaryIdleBody = {
                        currency: CONSTANTS.CURRENCY_USD,
                        journal : CONSTANTS.IDLE_PAYABLE,
                        date    : new Date(date),

                        sourceDocument: {
                            model: 'Employees',
                            _id  : employeeId,
                            name : empObject.name
                        }
                    };
                    var worked = employeeWorkedObject && employeeWorkedObject.worked ? employeeWorkedObject.worked : 0;
                    var idleHours;
                    var transferObj;
                    var totalInMonth = 0;
                    var hireKey = moment(new Date(hire[hire.length - 1])).year() * 100 + moment(new Date(hire[hire.length - 1])).month() + 1;
                    var fireKey = fire[0] ? moment(new Date(fire[fire.length - 1])).year() * 100 + moment(new Date(fire[fire.length - 1])).month() + 1 : Infinity;
                    var localKey = moment(endDate).year() * 100 + moment(endDate).month() + 1;

                    if (hireKey === localKey) {
                        localStartKey = moment(new Date(hire[hire.length - 1])).date();
                        startDate = moment(new Date(hire[hire.length - 1]));
                    }

                    if (fireKey === localKey) {
                        localEndDate = moment(new Date(fire[fire.length - 1])).date();
                    } else if (fireKey < localKey) {
                        localEndDate = localStartKey - 1;
                    }

                    transfer = _.sortBy(transfer, 'date');

                    for (i = transferLength - 1; i >= 0; i--) {
                        transferObj = transfer[i];

                        if ((moment(moment(startDate).add(12, 'hours')).isAfter(moment(transferObj.date))) || (moment(moment(startDate)).isSame(moment(transferObj.date)))) {
                            if (transferObj.status === 'fired') {
                                if (transfer[i - 1] && moment(startDate).isAfter(transfer[i - 1].date)) {
                                    salaryForDate = transferObj.salary;
                                    weeklyScheduler = transferObj.weeklyScheduler;
                                    department = transferObj.department;
                                    break;
                                }
                            } else if (transferObj.status !== 'transfer') {
                                salaryForDate = transferObj.salary;
                                weeklyScheduler = transferObj.weeklyScheduler;
                                department = transferObj.department;
                                break;
                            }
                        }
                    }

                    if (notDevArray.indexOf(department.toString()) !== -1) {
                        salaryForDate = 0;
                    }

                    weeklyScheduler = weeklyScheduler || {};

                    holidays.forEach(function (holiday) {
                        if ((holiday.day !== 0) && (holiday.day !== 6)) {
                            hoursToRemove += parseInt(weeklyScheduler[holiday.day], 10) || 0;
                        }
                    });

                    for (i = localEndDate; i >= localStartKey; i--) {
                        checkDate = moment(endDate).date(i).day();

                        if (checkDate === 0) {
                            checkDate = 7;
                        }
                        hoursInMonth += parseInt(weeklyScheduler[checkDate], 10) || 0;

                    }

                    for (i = moment(endDate).date(); i >= 1; i--) {
                        checkDate = moment(endDate).date(i).day();

                        if (checkDate === 0) {
                            checkDate = 7;
                        }
                        totalInMonth += parseInt(weeklyScheduler[checkDate], 10) || 0;

                    }
                    totalInMonth -= hoursToRemove;
                    hoursInMonth -= hoursToRemove;
                    idleHours = hoursInMonth - worked;

                    costForHour = isFinite(salaryForDate / totalInMonth) ? salaryForDate / totalInMonth : 0;

                    if (idleHours >= 0) {

                        vacationObject = _.find(vacations, function (vacation) {
                            return ((vacation.employee.toString() === employeeId.toString()) && (vacation.dateByMonth === dateByMonth));
                        });

                        if (vacationObject && vacationObject.vacArray) {
                            vacationObject.vacArray.forEach(function (vac, index) {
                                vacationDate = moment(startDate).date(index + 1);
                                dayOfWeek = vacationDate.day();

                                if (vac && (vac !== 'P') && (vac !== 'E') && (dayOfWeek !== 6) && (dayOfWeek !== 0)) {
                                    vacationHours += parseInt(weeklyScheduler[dayOfWeek], 10) || 0;
                                }
                            });
                        }

                        vacationCost = vacationHours * costForHour * 100;

                        salaryIdleBody.amount = (idleHours - vacationHours) * costForHour * 100;
                        vacationBody.amount = vacationCost;

                        if (vacationBody.amount > 0) {
                            createReconciled(vacationBody, {
                                dbName: req.session.lastDb,
                                uId   : req.session.uId,
                                cb    : cb
                            });
                        } else {
                            cb();
                        }

                        if (salaryIdleBody.amount > 0) {
                            createReconciled(salaryIdleBody, {
                                dbName: req.session.lastDb,
                                uId   : req.session.uId,
                                cb    : cb
                            });
                        } else {
                            cb();
                        }

                    } else if (idleHours < 0) {
                        console.log('bad employees wTracks', employeeId, localKey, hoursInMonth);
                        asyncCb();
                    }

                }, function () {
                    wfCb();
                });

            }

            waterfallFuncs = [parallelFuncFind, forEachEmployee];

            async.waterfall(waterfallFuncs, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        function closeDay(req, res, next, options, cb) {
            var dbName = req.session.lastDb;
            var uId = req.session.uId;
            var Model = models.get(dbName, 'journalEntry', journalEntrySchema);
            var Invoice = models.get(dbName, 'wTrackInvoice', invoiceSchema);
            var date = options && options.date || new Date();
            var accounts = options.accounts || [];
            var localDate = moment(new Date(date)).endOf('day');
            var jeDate = moment(localDate).subtract(3, 'hours');
            var waterlallTasks;
            var rates;
            var previousRates;
            var base;

            var UNREALIZED_LOSS = '565eb53a6aa50532e5df0b16';
            var UNREALIZED_GAIN = '565eb53a6aa50532e5df0b15';

            var getPreviousRate = function (wfCb) {
                ratesService.getPrevious({
                    id    : moment(localDate).format('YYYY-MM-DD'),
                    dbName: dbName
                }, wfCb);
            };

            var recalculateInvoices = function (prevRates, wfCb) {
                previousRates = prevRates.rates;

                base = prevRates.base || 'USD';

                Invoice.aggregate([{
                    $match: {
                        invoiceDate: {$lte: new Date(localDate)},
                        approved   : true
                    }
                }, {
                    $match: {
                        $and: [{
                            'currency.rate': {$exists: true}
                        }]
                    }
                }, {
                    $lookup: {
                        from        : 'Payment',
                        localField  : '_id',
                        foreignField: 'invoice',
                        as          : 'payments'
                    }
                }, {
                    $project: {
                        'currency._id' : 1,
                        'currency.rate': 1,
                        paymentInfo    : 1,
                        name           : 1,
                        forSales       : 1,
                        invoiceDate    : 1,
                        payments       : {
                            $filter: {
                                input: '$payments',
                                as   : 'payment',
                                cond : {$lte: ['$$payment.date', new Date(localDate)]}
                            }
                        }
                    }
                }, {
                    $match: {
                        'currency._id': {$ne: base}
                    }
                }, {
                    $unwind: {
                        path                      : '$payments',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        currency             : 1,
                        paymentInfo          : 1,
                        invoiceDate          : 1,
                        name                 : 1,
                        forSales             : 1,
                        'payments.paidAmount': 1,
                        'payments.currency'  : 1,
                        paid                 : {$divide: ['$payments.paidAmount', '$payments.currency.rate']}
                    }
                }, {
                    $group: {
                        _id        : '$_id',
                        currency   : {$first: '$currency'},
                        paymentInfo: {$first: '$paymentInfo'},
                        invoiceDate: {$first: '$invoiceDate'},
                        name       : {$first: '$name'},
                        forSales   : {$first: '$forSales'},
                        paid       : {$sum: '$paid'}
                    }
                }], function (err, result) {
                    if (err) {
                        return wfCb(err);
                    }

                    function forEachInvoice(result, wfCb) {
                        async.each(result, function (el, cb) {
                            var correctionBody;
                            var balance = el.paymentInfo.total - el.paid;
                            var newRate = ratesRetriever.getRate(rates, base, el.currency._id);
                            var prevRate = ratesRetriever.getRate(previousRates, base, el.currency._id);
                            var prevVal = balance / prevRate;
                            var nextVal = balance / newRate;
                            var account = el.forSales ? CONSTANTS.ACCOUNT_RECEIVABLE : CONSTANTS.ACCOUNT_PAYABLE;
                            var invoiceDateKey;
                            var localDateKey;
                            var invoiceDate = moment(new Date(el.invoiceDate));

                            invoiceDateKey = (invoiceDate.year() * 100 + invoiceDate.month()) * 100 + invoiceDate.date();
                            localDateKey = (localDate.year() * 100 + localDate.month()) * 100 + localDate.date();

                            if (invoiceDateKey === localDateKey) {
                                return cb();
                            }

                            correctionBody = {
                                journal       : null,
                                currency      : CONSTANTS.CURRENCY_USD,
                                date          : new Date(jeDate),
                                sourceDocument: {
                                    model: 'closeDay',
                                    name : el.name,
                                    _id  : el._id
                                },

                                uId          : uId,
                                dbName       : dbName,
                                amount       : Math.abs(prevVal - nextVal),
                                accountsItems: []
                            };

                            if (el.forSales) {
                                if (prevVal > nextVal) {
                                    // unrealized loss

                                    correctionBody.accountsItems.push({
                                        debit  : correctionBody.amount,
                                        credit : 0,
                                        account: UNREALIZED_LOSS
                                    }, {
                                        debit  : 0,
                                        credit : correctionBody.amount,
                                        account: account
                                    });
                                } else if (prevVal < nextVal) {
                                    // unrealized gain

                                    correctionBody.accountsItems.push({
                                        debit  : correctionBody.amount,
                                        credit : 0,
                                        account: account
                                    }, {
                                        debit  : 0,
                                        credit : correctionBody.amount,
                                        account: UNREALIZED_GAIN
                                    });
                                }
                            } else {
                                if (prevVal > nextVal) {
                                    // unrealized gain

                                    correctionBody.accountsItems.push({
                                        credit : correctionBody.amount,
                                        debit  : 0,
                                        account: UNREALIZED_GAIN
                                    }, {
                                        credit : 0,
                                        debit  : correctionBody.amount,
                                        account: account
                                    });
                                } else if (prevVal < nextVal) {
                                    // unrealized loss

                                    correctionBody.accountsItems.push({
                                        credit : correctionBody.amount,
                                        debit  : 0,
                                        account: account
                                    }, {
                                        credit : 0,
                                        debit  : correctionBody.amount,
                                        account: UNREALIZED_LOSS
                                    });
                                }
                            }

                            if (correctionBody.accountsItems.length) {
                                Model.remove({
                                    'sourceDocument._id'  : correctionBody.sourceDocument._id,
                                    'sourceDocument.name' : correctionBody.sourceDocument.name,
                                    'sourceDocument.model': correctionBody.sourceDocument.model,
                                    date                  : {
                                        $in: [correctionBody.date]
                                    }
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    JournalEntryService.createMultiRows(correctionBody, cb);

                                });
                            } else {
                                cb(null, result);
                            }
                        }, function (err, result) {
                            if (err) {
                                return wfCb(err);
                            }

                            wfCb(null, result);
                        });
                    }

                    ratesService.getById({
                        id    : moment(localDate).format('YYYY-MM-DD'),
                        dbName: dbName
                    }, function (err, ratesObject) {
                        if (err) {
                            return wfCb(err);
                        }

                        rates = ratesObject && ratesObject.rates || {};

                        forEachInvoice(result, wfCb);

                    });

                });
            };

            var createForBalances = function (result, cb) {
                var localStart = moment(new Date(localDate)).startOf('day');
                var localEnd = moment(new Date(localDate)).endOf('day');

                if (!accounts.length) {
                    return cb();
                }

                Model.aggregate([{
                    $match: {
                        account: {$in: accounts},
                        date   : {$lte: new Date(localEnd)}
                    }
                }, {
                    $project: {
                        account : 1,
                        debit   : 1,
                        credit  : 1,
                        debitFC : 1,
                        creditFC: 1
                    }
                }, {
                    $group: {
                        _id     : '$account',
                        debit   : {$sum: '$debit'},
                        credit  : {$sum: '$credit'},
                        debitFC : {$sum: '$debitFC'},
                        creditFC: {$sum: '$creditFC'}
                    }
                }, {
                    $lookup: {
                        from        : 'journalentries',
                        localField  : '_id',
                        foreignField: 'account',
                        as          : 'entries'
                    }
                }, {
                    $lookup: {
                        from        : 'PaymentMethod',
                        localField  : '_id',
                        foreignField: 'chartAccount',
                        as          : 'bankAccount'
                    }
                }, {
                    $project: {
                        _id        : 1,
                        debit      : 1,
                        credit     : 1,
                        debitFC    : 1,
                        creditFC   : 1,
                        bankAccount: {$arrayElemAt: ['$bankAccount', 0]},
                        entries    : {
                            $filter: {
                                input: '$entries',
                                as   : 'entry',
                                cond : {
                                    $and: [{
                                        $gt: ['$$entry.credit', 0]
                                    }, {
                                        $gte: ['$$entry.date', new Date(localStart)]
                                    }, {
                                        $lte: ['$$entry.date', new Date(localEnd)]
                                    }]
                                }
                            }
                        },

                        entriesToAdd: {
                            $filter: {
                                input: '$entries',
                                as   : 'entry',
                                cond : {
                                    $and: [{
                                        $gte: ['$$entry.date', new Date(localStart)]
                                    }, {
                                        $lte: ['$$entry.date', new Date(localEnd)]
                                    }]
                                }
                            }
                        }
                    }
                }, {
                    $group: {
                        _id         : '$account',
                        debit       : {$sum: '$debit'},
                        credit      : {$sum: '$credit'},
                        debitFC     : {$sum: '$debitFC'},
                        creditFC    : {$sum: '$creditFC'},
                        bankAccount : {$first: '$bankAccount'},
                        entriesToAdd: {$first: '$entriesToAdd'},
                        entries     : {$first: '$entries'}
                    }
                }], function (err, accountsBalances) {
                    if (err) {
                        return cb(err);
                    }

                    if (!rates) {
                        return cb();
                    }

                    async.each(accountsBalances, function (element, callback) {
                        var debit = element.debit;
                        var credit = element.credit;
                        var debitFC = element.debitFC;
                        var creditFC = element.creditFC;
                        var balance;
                        var balanceFC;
                        var newRate;
                        var balanceRated;
                        var balanceDiff;
                        var correctionBody;
                        var account = element.bankAccount.chartAccount;
                        var currencyId = element.bankAccount.currency;

                        if (!element.entries || !element.entries.length && element.entriesToAdd.length) {
                            element.entriesToAdd.forEach(function (el) {
                                debit -= el && el.debit || 0;
                                credit -= el && el.credit || 0;
                                debitFC -= el && el.debitFC || 0;
                                creditFC -= el && el.creditFC || 0;
                            });
                        }

                        balance = debit - credit;
                        balanceFC = debitFC - creditFC || balance;

                        // newRate = rates[element.bankAccount.currency] ? rates[element.bankAccount.currency][base] : balanceFC / balance;
                        newRate = ratesRetriever.getRate(rates, base, element.bankAccount.currency);
                        balanceRated = balanceFC / newRate;
                        balanceDiff = balance - balanceRated;

                        correctionBody = {
                            currency: {
                                _id : currencyId,
                                rate: newRate
                            },

                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeDay',
                                name : element.bankAccount.name,
                                _id  : element._id
                            },

                            uId          : uId,
                            dbName       : dbName,
                            amount       : Math.abs(balanceDiff),
                            accountsItems: []

                        };

                        if (balanceDiff > 0) {
                            // unrealized loss

                            correctionBody.accountsItems.push({
                                debit  : correctionBody.amount,
                                credit : 0,
                                account: UNREALIZED_LOSS
                            }, {
                                debit   : 0,
                                credit  : correctionBody.amount,
                                creditFC: correctionBody.amount,
                                account : account
                            });
                        } else if (balanceDiff < 0) {
                            // unrealized gain

                            correctionBody.accountsItems.push({
                                debit  : correctionBody.amount,
                                debitFC: correctionBody.amount,
                                credit : 0,
                                account: account
                            }, {
                                debit  : 0,
                                credit : correctionBody.amount,
                                account: UNREALIZED_GAIN
                            });
                        }

                        if (correctionBody.accountsItems.length) {
                            Model.remove({
                                'sourceDocument._id'  : correctionBody.sourceDocument._id,
                                'sourceDocument.name' : correctionBody.sourceDocument.name,
                                'sourceDocument.model': correctionBody.sourceDocument.model,
                                date                  : {
                                    $in: [correctionBody.date]
                                }
                            }, function (err) {
                                if (err) {
                                    return callback(err);
                                }

                                JournalEntryService.createMultiRows(correctionBody, callback);

                            });
                        } else {
                            callback(null, result);
                        }

                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                });
            };

            if (!accounts.length) {
                if (cb) {
                    return cb(null, result);
                }

                res.status(200).send({success: true});
            }

            waterlallTasks = [getPreviousRate, recalculateInvoices, createForBalances];

            async.waterfall(waterlallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (cb) {
                    return cb(null, result);
                }

                res.status(200).send({success: true});
            });
        }

        this.closeDay = function (req, res, next) {
            closeDay(req, res, next);
        };

        function closeMonth(req, res, next, dateObject, cb) {
            var dbName = req.session.lastDb;
            var uId = req.session.uId;
            var Model = models.get(dbName, 'journalEntry', journalEntrySchema);
            var Invoice = models.get(dbName, 'wTrackInvoice', invoiceSchema);
            var query = dateObject || req.body;
            var month = parseInt(query.month, 10);
            var year = parseInt(query.year, 10);
            var startDate = moment().year(year).month(month - 1).startOf('month');
            var localDate = moment().year(year).month(month - 1).endOf('month');
            var jeDate = moment(localDate).subtract(3, 'hours');
            var waterlallTasks;
            var productSales;
            var COGS;
            var rates;

            var REALIZED_GAIN = '565eb53a6aa50532e5df0be1';
            var REALIZED_LOSS = '565eb53a6aa50532e5df0be1';

            var UNREALIZED_GAIN = '565eb53a6aa50532e5df0b15';
            var UNREALIZED_LOSS = '565eb53a6aa50532e5df0b16';

            localDate = new Date(localDate);
            startDate = new Date(startDate);

            var parallelCreate = function (wfCb) {
                var parallelTasks;

                var realizedGain = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(REALIZED_GAIN) // realized Gain
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = Math.abs(debit - credit);

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : null,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            uId          : uId,
                            dbName       : dbName,
                            amount       : balance,
                            accountsItems: []

                        };

                        body.accountsItems.push({
                            debit  : body.amount,
                            credit : 0,
                            account: REALIZED_GAIN
                        }, {
                            debit  : 0,
                            credit : body.amount,
                            account: CONSTANTS.INCOME_SUMMARY_ACCOUNT
                        });

                        JournalEntryService.createMultiRows(body, cb);

                    });
                };

                var unrealizedGain = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(UNREALIZED_GAIN) // unrealized Gain
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = Math.abs(debit - credit);

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : null,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            uId          : uId,
                            dbName       : dbName,
                            amount       : balance,
                            accountsItems: []

                        };

                        body.accountsItems.push({
                            debit  : body.amount,
                            credit : 0,
                            account: UNREALIZED_GAIN
                        }, {
                            debit  : 0,
                            credit : body.amount,
                            account: CONSTANTS.INCOME_SUMMARY_ACCOUNT
                        });

                        JournalEntryService.createMultiRows(body, cb);
                    });
                };

                var realizedLoss = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(REALIZED_LOSS) // realized Loss
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = Math.abs(debit - credit);

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : null,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            uId          : uId,
                            dbName       : dbName,
                            amount       : balance,
                            accountsItems: []

                        };

                        body.accountsItems.push({
                            debit  : body.amount,
                            credit : 0,
                            account: REALIZED_LOSS
                        }, {
                            debit  : 0,
                            credit : body.amount,
                            account: CONSTANTS.INCOME_SUMMARY_ACCOUNT
                        });

                        JournalEntryService.createMultiRows(body, cb);
                    });
                };

                var unrealizedLoss = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(UNREALIZED_LOSS) // unrealized Loss
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = Math.abs(debit - credit);

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : null,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            uId          : uId,
                            dbName       : dbName,
                            amount       : balance,
                            accountsItems: []

                        };

                        body.accountsItems.push({
                            debit  : body.amount,
                            credit : 0,
                            account: UNREALIZED_LOSS
                        }, {
                            debit  : 0,
                            credit : body.amount,
                            account: CONSTANTS.INCOME_SUMMARY_ACCOUNT
                        });

                        JournalEntryService.createMultiRows(body, cb);
                    });
                };

                var createIncomeSummary = function (cb) {
                    var waterfallArray;
                    var closeSalesReturns = function (wfCb) {
                        Model.aggregate([{
                            $match: {
                                date: {
                                    $gte: startDate,
                                    $lte: localDate
                                },

                                account: objectId(CONSTANTS.SALES_RETURNS)
                            }
                        }, {
                            $group: {
                                _id   : null,
                                debit : {$sum: '$debit'},
                                credit: {$sum: '$credit'}
                            }
                        }], function (err, result) {
                            var debit;
                            var credit;
                            var balance;
                            var body;

                            if (err) {
                                return wfCb(err);
                            }

                            debit = result[0] ? result[0].debit : 0;
                            credit = result[0] ? result[0].credit : 0;
                            balance = Math.abs(debit - credit);

                            body = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : null,
                                date          : new Date(jeDate),
                                sourceDocument: {
                                    model: 'closeMonth',
                                    name : 'Close Month',
                                    _id  : null
                                },

                                uId          : uId,
                                dbName       : dbName,
                                amount       : balance,
                                accountsItems: []

                            };

                            body.accountsItems.push({
                                debit  : balance,
                                credit : 0,
                                account: CONSTANTS.PRODUCT_SALES
                            }, {
                                debit  : 0,
                                credit : balance,
                                account: CONSTANTS.SALES_RETURNS
                            });

                            JournalEntryService.createMultiRows(body, wfCb);
                        });
                    };

                    var closeIncomeSummary = function (result, wfCb) {
                        Model.aggregate([{
                            $match: {
                                date: {
                                    $gte: startDate,
                                    $lte: localDate
                                },

                                account: objectId(CONSTANTS.PRODUCT_SALES)
                            }
                        }, {
                            $group: {
                                _id   : null,
                                debit : {$sum: '$debit'},
                                credit: {$sum: '$credit'}
                            }
                        }], function (err, result) {
                            var debit;
                            var credit;
                            var balance;
                            var body;

                            if (err) {
                                return wfCb(err);
                            }

                            debit = result[0] ? result[0].debit : 0;
                            credit = result[0] ? result[0].credit : 0;
                            balance = Math.abs(debit - credit);

                            productSales = balance;

                            body = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.CREDIT_IS,
                                date          : new Date(jeDate),
                                sourceDocument: {
                                    model: 'closeMonth',
                                    name : 'Close Month',
                                    _id  : null
                                },

                                amount: balance
                            };

                            createReconciled(body, {
                                dbName: req.session.lastDb,
                                uId   : req.session.uId,
                                cb    : wfCb
                            });
                        });
                    };

                    waterfallArray = [closeSalesReturns, closeIncomeSummary];

                    async.waterfall(waterfallArray, function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                };

                var createCloseCOGS = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(CONSTANTS.COGS)
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = debit - credit;

                        COGS = balance;

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.CLOSE_COGS,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            amount: balance
                        };

                        createReconciled(body, {
                            dbName: req.session.lastDb,
                            uId   : req.session.uId,
                            cb    : cb
                        });
                    });
                };

                var createCloseVacation = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(CONSTANTS.VACATION_EXPENSES)
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = debit - credit;

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.CLOSE_VAC_EXP,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            amount: balance
                        };

                        createReconciled(body, {
                            dbName: req.session.lastDb,
                            uId   : req.session.uId,
                            cb    : cb
                        });
                    });
                };

                var createCloseIdle = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date                  : {$gte: startDate, $lte: localDate},
                            'sourceDocument.model': 'Employees',
                            journal               : objectId(CONSTANTS.IDLE_PAYABLE),
                            credit                : {$gt: 0}
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = Math.abs(debit - credit);

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.CLOSE_IDLE_EXP,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            amount: balance
                        };

                        createReconciled(body, {
                            dbName: req.session.lastDb,
                            uId   : req.session.uId,
                            cb    : cb
                        });
                    });
                };

                var createCloseAdminSalary = function (cb) {
                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(CONSTANTS.ADMIN_SALARY_EXPENSES)
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, result) {
                        var debit;
                        var credit;
                        var balance;
                        var body;

                        if (err) {
                            return cb(err);
                        }

                        debit = result[0] ? result[0].debit : 0;
                        credit = result[0] ? result[0].credit : 0;
                        balance = debit - credit;

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.CLOSE_ADMIN_EXP,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            amount: balance
                        };

                        createReconciled(body, {
                            dbName: req.session.lastDb,
                            uId   : req.session.uId,
                            cb    : cb
                        });
                    });
                };

                var createCloseTaxes = function (cb) {
                    OrganizationService.getDefaultTaxes({dbName: dbName, both: true}, function (err, taxes) {
                        var salesTax;
                        var purchaseTax;
                        var payableTax;
                        var carriedTax;
                        var getSalesTax;
                        var getPurchaseTax;
                        var getCarried;

                        if (err) {
                            return cb(err);
                        }

                        salesTax = taxes.salesTax;
                        purchaseTax = taxes.purchaseTax;
                        payableTax = taxes.payableTax;
                        carriedTax = taxes.carriedTax;

                        getSalesTax = function (callback) {
                            Model.aggregate([{
                                $match: {
                                    account: salesTax,
                                    date   : {
                                        $gte: startDate,
                                        $lte: localDate
                                    }
                                }
                            }, {
                                $group: {
                                    _id   : null,
                                    debit : {$sum: '$debit'},
                                    credit: {$sum: '$credit'}
                                }
                            }], function (err, result) {
                                var sum;

                                if (err) {
                                    return callback(err);
                                }

                                sum = result && result.length ? result[0].debit || result[0].credit : 0;

                                callback(null, sum);
                            });
                        };

                        getPurchaseTax = function (callback) {
                            Model.aggregate([{
                                $match: {
                                    account: salesTax,
                                    date   : {
                                        $gte: startDate,
                                        $lte: localDate
                                    }
                                }
                            }, {
                                $group: {
                                    _id   : null,
                                    debit : {$sum: '$debit'},
                                    credit: {$sum: '$credit'}
                                }
                            }], function (err, result) {
                                var sum;

                                if (err) {
                                    return callback(err);
                                }

                                sum = result && result.length ? result[0].debit || result[0].credit : 0;

                                callback(null, sum);
                            });
                        };

                        getCarried = function (callback) {
                            Model.aggregate([{
                                $match: {
                                    account: carriedTax,
                                    date   : {
                                        $gte: startDate,
                                        $lte: localDate
                                    }
                                }
                            }, {
                                $group: {
                                    _id   : null,
                                    debit : {$sum: '$debit'},
                                    credit: {$sum: '$credit'}
                                }
                            }], function (err, result) {
                                var sum;

                                if (err) {
                                    return callback(err);
                                }

                                sum = result && result.length ? result[0].debit || result[0].credit : 0;

                                callback(null, sum);
                            });
                        };

                        async.parallel([getSalesTax, getPurchaseTax, getCarried], function (err, result) {
                            var sales;
                            var purchase;
                            var carried;
                            var body;

                            if (err) {
                                return cb(err);
                            }

                            sales = result[0];
                            purchase = result[1];
                            carried = result[2];

                            body = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : null,
                                date          : new Date(jeDate),
                                sourceDocument: {
                                    model: 'closeMonth',
                                    name : 'Close Month',
                                    _id  : null
                                },

                                uId          : uId,
                                dbName       : dbName,
                                accountsItems: [],
                                amount       : Math.abs(sales)
                            };

                            if (sales - purchase > 0) {
                                body.accountsItems.push({
                                    debit  : sales,
                                    credit : 0,
                                    account: salesTax
                                }, {
                                    debit  : 0,
                                    credit : purchase,
                                    account: purchaseTax
                                });

                                if (salesTax - purchase <= carried) {
                                    body.accountsItems.push({
                                        debit  : 0,
                                        credit : salesTax - purchase,
                                        account: carriedTax
                                    });
                                } else {
                                    body.accountsItems.push({
                                        debit  : 0,
                                        credit : salesTax - purchase - carried,
                                        account: payableTax
                                    }, {
                                        debit  : 0,
                                        credit : carried,
                                        account: carriedTax
                                    });
                                }
                            } else if (sales - purchase > 0) {
                                body.accountsItems.push({
                                    debit  : sales,
                                    credit : 0,
                                    account: salesTax
                                }, {
                                    debit  : 0,
                                    credit : purchase,
                                    account: purchaseTax
                                }, {
                                    debit  : Math.abs(salesTax - purchase),
                                    credit : 0,
                                    account: carriedTax
                                });
                            }

                            JournalEntryService.createMultiRows(body, cb);
                        });

                    });
                };

                parallelTasks = [realizedGain, unrealizedGain, createIncomeSummary, createCloseCOGS, realizedLoss, unrealizedLoss, createCloseVacation, createCloseIdle, createCloseAdminSalary, createCloseTaxes];
                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return wfCb(err);
                    }

                    Model.aggregate([{
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: localDate
                            },

                            account: objectId(CONSTANTS.TOTAL_EXPENSES)
                        }
                    }, {
                        $group: {
                            _id   : null,
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }], function (err, je) {
                        var debit;
                        var credit;
                        var balance;
                        var body;
                        var cb;

                        if (err) {
                            return wfCb(err);
                        }

                        debit = je[0] ? je[0].debit : 0;
                        credit = je[0] ? je[0].credit : 0;
                        balance = Math.abs(debit - credit);

                        body = {
                            currency      : CONSTANTS.CURRENCY_USD,
                            journal       : CONSTANTS.CLOSE_ADMIN_BUD,
                            date          : new Date(jeDate),
                            sourceDocument: {
                                model: 'closeMonth',
                                name : 'Close Month',
                                _id  : null
                            },

                            amount: balance
                        };

                        cb = function () {
                            wfCb(null, result);
                        };

                        createReconciled(body, {
                            dbName: req.session.lastDb,
                            uId   : req.session.uId,
                            cb    : cb
                        });

                    });
                });
            };

            var createRE = function (result, wfCb) {
                Model.aggregate([{
                    $match: {
                        date: {
                            $gte: startDate,
                            $lte: localDate
                        },

                        account: objectId(CONSTANTS.INCOME_SUMMARY_ACCOUNT)
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    var debit;
                    var credit;
                    var balance;
                    var body;

                    if (err) {
                        return wfCb(err);
                    }

                    debit = result[0] ? result[0].debit : 0;
                    credit = result[0] ? result[0].credit : 0;
                    // balance = Math.abs(debit - credit);

                    balance = Math.abs(productSales - COGS);

                    body = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.RETAINED_EARNINGS,
                        date          : new Date(jeDate),
                        sourceDocument: {
                            model: 'closeMonth',
                            name : 'Close Month',
                            _id  : null
                        },

                        amount: balance
                    };

                    if (productSales - COGS < 0) {
                        body.reverse = true;
                    }

                    createReconciled(body, {
                        dbName: req.session.lastDb,
                        uId   : req.session.uId,
                        cb    : wfCb
                    });
                });
            };

            waterlallTasks = [parallelCreate, createRE];

            async.waterfall(waterlallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (cb) {
                    cb(null, result);
                } else {
                    res.status(200).send({success: true});
                }
            });
        }

        this.closeMonth = function (req, res, next) {
            closeMonth(req, res, next);
        };

        function recloseDay(req, res, next, options, mainCb) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
            var body = options || req.body;
            var startDate = body.startDate ? moment(new Date(body.startDate)) : moment().subtract(1, 'month');
            var endDate = body.endDate ? moment(new Date(body.endDate)) : moment();
            var check = new Date(endDate) - new Date(startDate);
            var datesArray = [];
            var date;
            var dateEnd;
            var localDate;
            var i;
            var q;

            do {
                datesArray.push(moment(new Date(startDate)).format('YYYY-MM-DD'));

                startDate = moment(new Date(startDate)).add(1, 'day').format('YYYY-MM-DD');

                check = new Date(endDate) - new Date(startDate);
            } while (check >= 0);

            OrganizationService.getBaseCurrency({dbName: req.session.lastDb}, function (err, base) {
                if (err && mainCb) {
                    return mainCb(err);
                }

                if (err && next) {
                    return next(err);
                }

                PaymentMethod.aggregate([{
                    $match: {
                        currency: {$ne: base}
                    }
                }, {
                    $group: {
                        _id     : null,
                        accounts: {$addToSet: '$chartAccount'}
                    }
                }], function (err, result) {
                    var accounts;

                    if (err && mainCb) {
                        return mainCb(err);
                    }

                    if (err && next) {
                        return next(err);
                    }

                    accounts = result && result.length ? result[0].accounts : [];

                    if (!accounts.length) {
                        if (mainCb) {
                            return mainCb(null, {success: true});
                        }

                        res.status(200).send({success: true});
                    }

                    q = async.queue(function (date, callback) {
                        dateEnd = moment(new Date(date)).endOf('day');
                        localDate = moment(dateEnd).subtract(3, 'hours');

                        closeDay(req, res, callback, {
                            date    : date,
                            accounts: accounts
                        }, callback);
                    });

                    q.drain = function () {
                        if (mainCb) {
                            return mainCb(null, {success: true});
                        }

                        res.status(200).send({success: true});
                    };

                    for (i = 0; i < datesArray.length; i++) {
                        date = datesArray[i];

                        q.push(date, function (err) {
                            if (err && mainCb) {
                                return mainCb(err);
                            }

                            if (err && next) {
                                return next(err);
                            }
                        });
                    }
                });
            })

            /*   if (mainCb) {
             return mainCb(null, {success: true});
             }

             res.status(200).send({success: true});*/
        }

        this.recloseDay = function (req, res, next) {
            recloseDay(req, res, next);
        };

        this.recloseMonth = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var body = req.body;

            async.each(body, function (date, cb) {
                var endDate = moment(date).endOf('month');
                var startDate = moment(date).startOf('month');

                Model.remove({
                    'sourceDocument.model': 'closeMonth',
                    // journal: {$in: CONSTANTS.CLOSE_MONTH_JOURNALS},
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)}
                }, function () {
                    var month = moment(date).month() + 1;
                    var year = moment(date).year();
                    closeMonth(req, res, next, {month: month, year: year}, cb);
                });
            }, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: true});
            });
        };

        this.createCostsForJob = function (options) {
            var req = options.req;
            var jobsArray = options.jobId;
            var newReq = req;

            var cb = options.callback || function () {
                    return false;
                };

            newReq.body.jobs = jobsArray;

            reconcile(req, null, cb, cb);
        };

        this.reconcile = function (req, res, next) {
            reconcile(req, res, next);
        };

        function reconcile(req, res, next, cb) {
            var dbName = req.session.lastDb;
            var Model = models.get(dbName, journalEntryCT, journalEntrySchema);
            var WTrack = models.get(dbName, 'wTrack', wTrackSchema);
            var Invoice = models.get(dbName, 'Invoices', invoiceSchema);
            var Payment = models.get(dbName, 'InvoicePayment', InvoicePaymentSchema);
            var Job = models.get(dbName, 'jobs', jobsSchema);
            var body = req.body;
            var dateNow = moment();
            var month = 8;
            var year = 2014;
            /* var month = body.month ? parseInt(body.month, 10) : dateNow.get('month') + 1;
             var year = body.year ? parseInt(body.year, 10) : dateNow.get('year');*/
            var date = body.date ? moment(new Date(body.date)) : moment().year(year).month(month - 1).endOf('month');
            var jobIds = body.jobs;
            var reconcileSalaryEntries;
            var reconcileInvoiceEntries;
            var timeToSet = {hour: 15, minute: 1, second: 0, millisecond: 0};
            var parallelTasks;
            var resultArray = [];
            var paymentsArray = [];
            var parallelFunction;
            var reconcileJobs;
            var mainWaterfallTasks;
            var getJobsToCreateExpenses;
            var waterfallTasks;
            var recloseDaysFunc;
            var match = {};
            var dontReclose = false;

            if (jobIds && !Array.isArray(jobIds)) {
                jobIds = [jobIds];
                match = {
                    jobs: {$in: jobIds}
                };

                dontReclose = true;
            }

            getJobsToCreateExpenses = function (mainCb) {
                WTrack.aggregate([{
                    $match: match
                }, {
                    $group: {
                        _id: '$jobs'
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return mainCb(err);
                    }

                    jobIds = _.pluck(result, '_id');

                    if (res && res.status) {
                        res.status(200).send({success: true});
                    }

                    mainCb();
                });
            };

            parallelFunction = function (mainCb) {
                reconcileInvoiceEntries = function (mainCallback) {
                    Invoice.aggregate([{
                        $match: {
                            // reconcile: true,
                            approved: true,
                            _type   : {$in: ['purchaseInvoices', 'Invoices']}
                        }
                    }, {
                        $lookup: {
                            from        : 'Payment',
                            localField  : '_id',
                            foreignField: 'invoice',
                            as          : 'payments'
                        }
                    }, {
                        $project: {
                            _id     : 1,
                            payments: 1
                        }
                    }], function (err, result) {
                        var parallelRemove;
                        var parallelCreate;
                        var parallelCreateForPayments;

                        if (err) {
                            return mainCallback(err);
                        }

                        result.forEach(function (el) {
                            resultArray.push(el._id);
                            el.payments.forEach(function (pym) {
                                paymentsArray.push(pym._id);
                            });
                        });

                        parallelRemove = function (cb) {
                            Model.remove({
                                'sourceDocument._id': {$in: resultArray.concat(paymentsArray)}
                            }, function (err) {
                                if (err) {
                                    return cb(err);
                                }

                                Model.remove({
                                    'sourceDocument.model': 'closeDay',
                                    date                  : {$gte: new Date(date)}
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    cb(null, resultArray);
                                });
                            });
                        };

                        function findPrepayments(resultArray, cb) {
                            Invoice.aggregate([{
                                $match: {
                                    _id: {$in: resultArray}
                                }
                            }, {
                                $project: {
                                    sourceDocument: 1
                                }
                            }, {
                                $lookup: {
                                    from        : 'Payment',
                                    localField  : 'sourceDocument',
                                    foreignField: 'order',
                                    as          : 'payment'
                                }
                            }, {
                                $project: {
                                    payment: 1
                                }
                            }], function (err, result) {
                                if (err) {
                                    return cb(err);
                                }

                                cb(null, result);
                            });
                        }

                        parallelCreate = function (result, cb) {
                            OrganizationService.getDefaultTaxes({dbName: dbName, both: true}, function (err, tax) {
                                if (err) {
                                    return cb(err);
                                }

                                async.each(resultArray, function (element, asyncCb) {
                                    Invoice.aggregate([{
                                        $match: {
                                            _id: element
                                        }
                                    }, {
                                        $lookup: {
                                            from        : 'journals',
                                            localField  : 'journal',
                                            foreignField: '_id',
                                            as          : 'journal'
                                        }
                                    }, {
                                        $project: {
                                            journal       : {$arrayElemAt: ['$journal', 0]},
                                            forSales      : 1,
                                            name          : 1,
                                            paymentInfo   : 1,
                                            currency      : 1,
                                            invoiceDate   : 1,
                                            sourceDocument: 1
                                        }
                                    }, {
                                        $lookup: {
                                            from        : 'Payment',
                                            localField  : 'sourceDocument',
                                            foreignField: 'order',
                                            as          : 'prepayments'
                                        }
                                    }], function (err, invoice) {
                                        var cb = asyncCb;
                                        var paidAmount = 0;
                                        var beforeInvoiceBody = {};
                                        var journalEntryBody = {};

                                        if (err) {
                                            return asyncCb(err);
                                        }

                                        invoice = invoice && invoice.length ? invoice[0] : {};

                                        invoice.prepayments.forEach(function (payment) {
                                            paidAmount += payment.paidAmount / payment.currency.rate;
                                        });

                                        journalEntryBody.date = invoice.invoiceDate;
                                        journalEntryBody.journal = invoice.journal ? invoice.journal._id : CONSTANTS.INVOICE_JOURNAL;
                                        journalEntryBody.currency = invoice.currency ? invoice.currency._id : 'USD';
                                        journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total/* / invoice.currency.rate*/ : 0;
                                        journalEntryBody.sourceDocument = {};
                                        journalEntryBody.sourceDocument._id = invoice._id;
                                        journalEntryBody.sourceDocument.model = 'Invoice';
                                        journalEntryBody.sourceDocument.name = invoice.name;
                                        journalEntryBody.uId = req.session.uId;
                                        journalEntryBody.dbName = dbName;

                                        journalEntryBody.accountsItems = [];

                                        if (invoice.forSales) {
                                            journalEntryBody.accountsItems.push({
                                                debit  : journalEntryBody.amount,
                                                credit : 0,
                                                account: invoice.journal ? invoice.journal.debitAccount : CONSTANTS.ACCOUNT_RECEIVABLE
                                            }, {
                                                debit  : 0,
                                                credit : invoice.paymentInfo.unTaxed,
                                                account: invoice.journal ? invoice.journal.creditAccount : CONSTANTS.PRODUCT_SALES
                                            });
                                        } else {
                                            journalEntryBody.accountsItems.push({
                                                debit  : invoice.paymentInfo.unTaxed,
                                                credit : 0,
                                                account: invoice.journal ? invoice.journal.debitAccount : CONSTANTS.INVENTORY
                                            }, {
                                                debit  : 0,
                                                credit : journalEntryBody.amount,
                                                account: invoice.journal ? invoice.journal.creditAccount : CONSTANTS.ACCOUNT_PAYABLE
                                            });
                                        }

                                        if (invoice.paymentInfo.taxes) {
                                            if (invoice.forSales) {
                                                journalEntryBody.accountsItems.push({
                                                    debit  : 0,
                                                    credit : invoice.paymentInfo.taxes,
                                                    account: tax.salesTax
                                                });
                                            } else {
                                                journalEntryBody.accountsItems.push({
                                                    debit  : invoice.paymentInfo.taxes,
                                                    credit : 0,
                                                    account: tax.purchaseTax
                                                });
                                            }

                                        }

                                        if (paidAmount) {
                                            cb = _.after(2, cb);

                                            beforeInvoiceBody.date = invoice.invoiceDate;
                                            beforeInvoiceBody.journal = null; // CONSTANTS.BEFORE_INVOICE;
                                            beforeInvoiceBody.currency = {};
                                            beforeInvoiceBody.currency._id = invoice.currency ? invoice.currency._id : 'USD';
                                            beforeInvoiceBody.currency.rate = invoice.currency ? invoice.currency.rate : 1;
                                            beforeInvoiceBody.amount = paidAmount;
                                            beforeInvoiceBody.sourceDocument = {};
                                            beforeInvoiceBody.sourceDocument._id = invoice._id;
                                            beforeInvoiceBody.sourceDocument.model = 'Invoice';
                                            beforeInvoiceBody.sourceDocument.name = invoice.name;
                                            beforeInvoiceBody.uId = req.session.uId;
                                            beforeInvoiceBody.dbName = dbName;
                                            beforeInvoiceBody.notDivideRate = true;

                                            beforeInvoiceBody.accountsItems = [{
                                                debit  : beforeInvoiceBody.amount,
                                                credit : 0,
                                                account: CONSTANTS.USR
                                            }, {
                                                debit  : 0,
                                                credit : beforeInvoiceBody.amount,
                                                account: CONSTANTS.ACCOUNT_RECEIVABLE
                                            }];

                                            JournalEntryService.createMultiRows(beforeInvoiceBody, cb);
                                        }

                                        JournalEntryService.createMultiRows(journalEntryBody, cb);

                                    });
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    cb(null, result);
                                });
                            });

                        };

                        parallelCreateForPayments = function (result, cb) {
                            Payment.find({order: {$ne: null}}, {_id: 1}, function (err, result) {
                                var ids;

                                if (err) {
                                    return cb(err);
                                }

                                ids = _.pluck(result, '_id');

                                paymentsArray = paymentsArray.concat(ids);

                                async.each(paymentsArray, function (element, asyncCb) {
                                    Payment.findById(element).populate('invoice').populate('order').exec(function (err, model) {
                                        var invoiceRate;
                                        var PaymRate;
                                        var journal;
                                        var date;
                                        var accountsItems = [];
                                        var source;
                                        var debitAccount;
                                        var creditAccount;
                                        var invoiceType;
                                        var isForSale;
                                        var gainAccount;
                                        var lossAccount;
                                        var amountByInvoice;
                                        var differenceAmount;
                                        var prevRates = {};
                                        var fx = {};

                                        if (err) {
                                            return asyncCb(err);
                                        }

                                        ratesService.getPreviousAndCurrent({
                                            id    : moment(model.date).format('YYYY-MM-DD'),
                                            dbName: dbName
                                        }, function (err, ratesObject) {
                                            if (err) {
                                                return asyncCb(err);
                                            }

                                            prevRates.rates = ratesObject && ratesObject.previous ? ratesObject.previous : {};
                                            prevRates.base = ratesObject && ratesObject.base ? ratesObject.base : 'USD';
                                            fx.rates = ratesObject && ratesObject.current ? ratesObject.current : {};
                                            fx.base = ratesObject && ratesObject.base ? ratesObject.base : 'USD';

                                            if (model) {

                                                source = model.invoice && model.invoice._id ? model.invoice : model.order && model.order._id ? model.order : {};
                                                invoiceType = model.invoice && model.invoice._type ? model.invoice : model.order && model.order._type ? model.order : null;
                                                isForSale = model.forSale;

                                                if (isForSale) {
                                                    if (invoiceType === 'Order') {
                                                        debitAccount = model.bankAccount;
                                                        creditAccount = CONSTANTS.USR;
                                                    } else {
                                                        debitAccount = model.bankAccount;
                                                        creditAccount = CONSTANTS.ACCOUNT_RECEIVABLE;
                                                    }

                                                } else {
                                                    creditAccount = model.bankAccount;
                                                    debitAccount = CONSTANTS.ACCOUNT_PAYABLE;
                                                }

                                                date = moment(new Date(model.date));

                                                date = date.format('YYYY-MM-DD');
                                                journal = model.journal || CONSTANTS.PAYMENT_JOURNAL;

                                                if (model._type === 'prepayment') {
                                                    journal = CONSTANTS.PROFORMA_JOURNAL;
                                                }

                                                source.currency = source.currency || {_id: fx.base};

                                                invoiceRate = ratesRetriever.getRate(prevRates.rates, fx.base, source.currency._id);

                                                amountByInvoice = model.paidAmount / invoiceRate;
                                                differenceAmount = model.paidAmount / ratesRetriever.getRate(fx.rates, fx.base, model.currency._id || fx.base);

                                                body = {
                                                    currency      : model.currency._id,
                                                    journal       : journal,
                                                    date          : new Date(date),
                                                    sourceDocument: {
                                                        model: 'Payment',
                                                        _id  : model._id,
                                                        name : model.name
                                                    },

                                                    accountsItems: accountsItems,
                                                    amount       : PaymRate
                                                };

                                                if (model.paymentMethod.currency !== prevRates.base) {
                                                    gainAccount = '565eb53a6aa50532e5df0b15'; // unrealized
                                                    lossAccount = '565eb53a6aa50532e5df0b16'; // unrealized
                                                } else {
                                                    gainAccount = '565eb53a6aa50532e5df0be1'; // foreign ex gain
                                                    lossAccount = '565eb53a6aa50532e5df0be3'; // foreign ex loss
                                                }

                                                if (isFinite(amountByInvoice) && Math.abs(amountByInvoice - differenceAmount) !== 0) {

                                                    if (isForSale) {
                                                        if (differenceAmount > amountByInvoice) {
                                                            body.accountsItems.push({
                                                                debit  : 0,
                                                                credit : Math.abs(amountByInvoice - differenceAmount),
                                                                account: gainAccount
                                                            });

                                                        } else if (differenceAmount < amountByInvoice) {

                                                            body.accountsItems.push({
                                                                credit : 0,
                                                                debit  : Math.abs(amountByInvoice - differenceAmount),
                                                                account: lossAccount
                                                            });

                                                        }
                                                    } else {
                                                        if (differenceAmount > amountByInvoice) {
                                                            body.accountsItems.push({
                                                                credit : 0,
                                                                debit  : Math.abs(amountByInvoice - differenceAmount),
                                                                account: gainAccount
                                                            });

                                                        } else if (differenceAmount < amountByInvoice) {

                                                            body.accountsItems.push({
                                                                debit  : 0,
                                                                credit : Math.abs(amountByInvoice - differenceAmount),
                                                                account: lossAccount
                                                            });

                                                        }
                                                    }

                                                }

                                                if (isForSale) {
                                                    body.accountsItems.push({
                                                        debit   : 0,
                                                        credit  : amountByInvoice,
                                                        creditFC: model.paidAmount,
                                                        account : creditAccount
                                                    }, {
                                                        credit : 0,
                                                        debit  : differenceAmount - model.bankExpenses.amount,
                                                        debitFC: model.paidAmount,
                                                        account: debitAccount
                                                    });
                                                } else {
                                                    body.accountsItems.push({
                                                        debit   : 0,
                                                        credit  : differenceAmount - model.bankExpenses.amount,
                                                        creditFC: model.paidAmount,
                                                        account : creditAccount
                                                    }, {
                                                        credit : 0,
                                                        debit  : amountByInvoice,
                                                        // debitFC: differenceAmount,
                                                        account: debitAccount
                                                    });
                                                }

                                                createMultiRows(body, {
                                                    dbName       : req.session.lastDb,
                                                    uId          : req.session.uId,
                                                    cb           : asyncCb,
                                                    notDivideRate: true
                                                });
                                            } else {
                                                asyncCb();
                                            }
                                        });
                                    });
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    cb();
                                });

                            });
                        };

                        waterfallTasks = [parallelRemove, findPrepayments, parallelCreate, parallelCreateForPayments];

                        async.waterfall(waterfallTasks, function (err) {
                            if (err) {
                                return mainCallback(err);
                            }

                            Invoice.update({_id: {$in: resultArray}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {
                                if (err) {
                                    return mainCallback(err);
                                }

                                // res.status(200).send({success: true});
                                if (event) {
                                    event.emit('sendMessage', {
                                        view   : journalEntryCT,
                                        message: 'Invoices and Proformas were reconciled',
                                        dbName : dbName
                                    });
                                }

                                mainCallback();
                            });
                        });
                    });
                };

                reconcileSalaryEntries = function (mainCallback) {
                    var skip = 0;
                    var limit = 0;
                    var count = Math.ceil(jobIds.length / 10);
                    var i;
                    var countsArray = [];
                    var aggregate;
                    var resultArray = [];

                    async.each(jobIds, function (id, cb) {
                        aggregate = WTrack.aggregate([{
                            $match: {
                                jobs: id
                            }
                        }, {
                            $lookup: {
                                from        : 'Products',
                                localField  : 'jobs',
                                foreignField: 'job',
                                as          : 'product'
                            }
                        }, {
                            $project: {
                                product    : {$arrayElemAt: ['$product', 0]},
                                employee   : 1,
                                _type      : 1,
                                dateByMonth: {$add: [{$multiply: ['$year', 100]}, '$month']},
                                worked     : 1
                            }
                        }, {
                            $group: {
                                _id: {
                                    employee   : '$employee',
                                    _type      : '$_type',
                                    dateByMonth: '$dateByMonth',
                                    product    : '$product'
                                },

                                hours: {$sum: '$worked'}
                            }
                        }, {
                            $lookup: {
                                from        : 'MonthHours',
                                localField  : '_id.dateByMonth',
                                foreignField: 'dateByMonth',
                                as          : 'dateByMonth'
                            }
                        }, {
                            $project: {
                                dateByMonth: {$arrayElemAt: ['$dateByMonth', 0]},
                                hours      : 1
                            }
                        }, {
                            $lookup: {
                                from        : 'Vacation',
                                localField  : '_id.dateByMonth',
                                foreignField: 'dateByMonth',
                                as          : 'vacations'
                            }
                        }, {
                            $project: {
                                overheadRate: '$dateByMonth.overheadRate',
                                hoursInMonth: '$dateByMonth.hours',
                                dateByMonth : '$dateByMonth.dateByMonth',
                                hours       : 1
                            }
                        }, {
                            $lookup: {
                                from        : 'Employees',
                                localField  : '_id.employee',
                                foreignField: '_id',
                                as          : 'employee'
                            }
                        }, {
                            $lookup: {
                                from        : 'Holiday',
                                localField  : 'dateByMonth',
                                foreignField: 'dateByMonth',
                                as          : 'holidays'
                            }
                        }, {
                            $project: {
                                employee    : {$arrayElemAt: ['$employee', 0]},
                                overheadRate: 1,
                                hoursInMonth: 1,
                                dateByMonth : 1,
                                holidays    : 1,
                                hours       : 1
                            }
                        }, {
                            $lookup: {
                                from        : 'transfers',
                                localField  : 'employee._id',
                                foreignField: 'employee',
                                as          : 'employee.transfer'
                            }
                        }, {
                            $project: {
                                transfer    : '$employee.transfer',
                                employee    : '$employee._id',
                                employeeName: {$concat: ['$employee.name.first', ' ', '$employee.name.last']},
                                dateByMonth : 1,
                                hoursInMonth: 1,
                                overheadRate: 1,
                                holidays    : 1,
                                hours       : 1
                            }
                        }, {
                            $unwind: '$transfer'
                        }, {
                            $lookup: {
                                from        : 'weeklySchedulers',
                                localField  : 'transfer.weeklyScheduler',
                                foreignField: '_id',
                                as          : 'transfer.weeklyScheduler'
                            }
                        }, {
                            $project: {
                                'transfer.weeklyScheduler': {$arrayElemAt: ['$transfer.weeklyScheduler', 0]},
                                'transfer.date'           : 1,
                                'transfer.salary'         : 1,
                                'transfer.status'         : 1,
                                employee                  : 1,
                                employeeName              : 1,
                                dateByMonth               : 1,
                                hoursInMonth              : 1,
                                overheadRate              : 1,
                                holidays                  : 1,
                                hours                     : 1
                            }
                        }, {
                            $group: {
                                _id: {
                                    employee   : '$_id.employee',
                                    _type      : '$_id._type',
                                    dateByMonth: '$_id.dateByMonth',
                                    product    : '$_id.product'
                                },

                                transfer    : {$addToSet: '$transfer'},
                                employee    : {$first: '$employee'},
                                employeeName: {$first: '$employeeName'},
                                dateByMonth : {$first: '$dateByMonth'},
                                hoursInMonth: {$first: '$hoursInMonth'},
                                overheadRate: {$first: '$overheadRate'},
                                holidays    : {$first: '$holidays'},
                                hours       : {$first: '$hours'}
                            }
                        }]);

                        aggregate.options = {allowDiskUse: true};
                        aggregate.exec(function (err, result) {
                            if (err) {
                                return cb(err);
                            }

                            resultArray = resultArray.concat(result);

                            cb();
                        });

                    }, function (err) {
                        if (err) {
                            return mainCallback(err);
                        }

                        async.each(resultArray, function (item, cb) {
                            var employee = item.employee;
                            var hours = item.hours;
                            var product = item._id.product ? item._id.product._id : null;
                            var _type = item._id._type;
                            var overheadRate = item.overheadRate;
                            var dateByMonth = item.dateByMonth || item._id.dateByMonth;
                            var holidays = item.holidays;
                            var transfer = item.transfer;
                            var transferLength = transfer.length;
                            var salaryForDate = 0;
                            var hoursInMonth = 0;
                            var costForHour = 0;
                            var weeklyScheduler = {};
                            var hoursToRemove = 0;
                            var year = dateByMonth.toString().slice(0, 4);
                            var month = dateByMonth.toString().slice(4);
                            var endDate = moment().year(year).month(month - 1).endOf('month');
                            var checkDate;
                            var startDate = moment().year(year).month(month - 1).startOf('month');
                            var entryDate = moment(endDate);
                            var dateNow = moment();
                            var bodySalary;
                            var bodyOvertime;
                            var bodyOverhead;
                            var i;
                            var transferObj;

                            if (entryDate > dateNow) {
                                entryDate = dateNow;
                            }

                            if (!product) {
                                return cb();
                            }

                            bodySalary = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.SALARY_PAYABLE,
                                date          : entryDate.set(timeToSet),
                                sourceDocument: {
                                    model   : 'product',
                                    _id     : product,
                                    employee: employee,
                                    name    : item.employeeName
                                }
                            };

                            bodyOvertime = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.OVERTIME_PAYABLE,
                                date          : entryDate.set(timeToSet),
                                sourceDocument: {
                                    model   : 'product',
                                    _id     : product,
                                    employee: employee,
                                    name    : item.employeeName
                                }
                            };

                            bodyOverhead = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : CONSTANTS.OVERHEAD,
                                date          : entryDate.set(timeToSet),
                                sourceDocument: {
                                    model   : 'product',
                                    _id     : product,
                                    employee: employee,
                                    name    : item.employeeName
                                }
                            };

                            if (!dateByMonth) {
                                console.log('notDateBymonth');
                                return cb();
                            }

                            transfer = _.sortBy(transfer, 'date');

                            if ((parseInt(year, 10) * 100 + parseInt(month, 10)) === (moment(transfer[0].date).year() * 100 + moment(transfer[0].date).month() + 1)) {
                                startDate = moment(transfer[0].date);
                            }

                            transfer = _.sortBy(transfer, 'date');

                            for (i = transferLength - 1; i >= 0; i--) {
                                transferObj = transfer[i];

                                if ((moment(moment(startDate).add(12, 'hours')).isAfter(moment(transferObj.date))) || (moment(moment(startDate)).isSame(moment(transferObj.date)))) {
                                    if (transferObj.status === 'fired') {
                                        if (transfer[i - 1] && moment(startDate).isAfter(transfer[i - 1].date)) {
                                            salaryForDate = transferObj.salary;
                                            weeklyScheduler = transferObj.weeklyScheduler;
                                            break;
                                        }
                                    } else if (transferObj.status !== 'transfer') {
                                        salaryForDate = transferObj.salary;
                                        weeklyScheduler = transferObj.weeklyScheduler;
                                        break;
                                    }
                                }
                            }

                            if (!Object.keys(weeklyScheduler).length) {
                                weeklyScheduler = {
                                    1         : 8,
                                    2         : 8,
                                    3         : 8,
                                    4         : 8,
                                    5         : 8,
                                    6         : 0,
                                    7         : 0,
                                    name      : 'UA-40',
                                    totalHours: 40
                                };
                            }

                            holidays.forEach(function (holiday) {
                                if ((holiday.day !== 0) && (holiday.day !== 6)) {
                                    hoursToRemove += parseInt(weeklyScheduler[holiday.day], 10) || 0;
                                }
                            });

                            for (i = endDate.date(); i >= 1; i--) {
                                checkDate = moment(endDate).date(i).day();

                                if (checkDate === 0) {
                                    checkDate = 7;
                                }
                                hoursInMonth += parseInt(weeklyScheduler[checkDate], 10) || 0;
                            }

                            hoursInMonth -= hoursToRemove;

                            costForHour = isFinite(salaryForDate / hoursInMonth) ? salaryForDate / hoursInMonth : 0;

                            Model.remove({
                                'sourceDocument._id'     : product,
                                date                     : {$gte: new Date(startDate), $lte: new Date(endDate)},
                                'sourceDocument.employee': employee
                            }, function (err, removed) {

                                var methodCb = _.after(2, function (err, result) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    cb(null, result);
                                });

                                if (_type === 'overtime') {
                                    bodyOvertime.amount = hours * costForHour * 100;
                                    bodyOverhead.amount = hours * overheadRate * 100;

                                    if (bodyOverhead.amount > 0) {
                                        createReconciled(bodyOverhead, {
                                            dbName: req.session.lastDb,
                                            uId   : req.session.uId,
                                            cb    : methodCb
                                        });
                                    } else {
                                        methodCb();
                                    }

                                    if (bodyOvertime.amount > 0) {
                                        createReconciled(bodyOvertime, {
                                            dbName: req.session.lastDb,
                                            uId   : req.session.uId,
                                            cb    : methodCb
                                        });
                                    } else {
                                        methodCb();
                                    }

                                } else if (_type === 'ordinary') {
                                    bodySalary.amount = hours * costForHour * 100;
                                    bodyOverhead.amount = hours * overheadRate * 100;

                                    if (bodySalary.amount > 0) {
                                        createReconciled(bodySalary, {
                                            dbName: req.session.lastDb,
                                            uId   : req.session.uId,
                                            cb    : methodCb
                                        });
                                    } else {
                                        methodCb();
                                    }

                                    if (bodyOverhead.amount > 0) {
                                        createReconciled(bodyOverhead, {
                                            dbName: req.session.lastDb,
                                            uId   : req.session.uId,
                                            cb    : methodCb
                                        });
                                    } else {
                                        methodCb();
                                    }
                                }

                            });
                        }, function (err) {
                            if (err) {
                                return mainCallback(err);
                            }

                            mainCallback();
                        });

                    });
                };

                parallelTasks = [reconcileInvoiceEntries, reconcileSalaryEntries];

                async.parallel(parallelTasks, function (err, result) {
                    if (err) {
                        return mainCb(err);
                    }
                    mainCb(null, result);
                });
            };

            reconcileJobs = function (result, mainCb) {

                Job.aggregate([{
                    $match: {
                        _id: {$in: jobIds}
                    }
                }, {
                    $lookup: {
                        from        : 'Products',
                        localField  : '_id',
                        foreignField: 'job',
                        as          : 'product'
                    }
                }, {
                    $lookup: {
                        from        : 'Order',
                        localField  : 'order',
                        foreignField: '_id',
                        as          : 'order'
                    }
                }, {
                    $project: {
                        order  : {$arrayElemAt: ['$order', 0]},
                        product: {$arrayElemAt: ['$product', 0]}
                    }
                }, {
                    $lookup: {
                        from        : 'GoodsNote',
                        localField  : 'order._id',
                        foreignField: 'order',
                        as          : 'goodsNote'
                    }
                }, {
                    $project: {
                        goodsNote: {$arrayElemAt: ['$goodsNote', 0]},
                        product  : '$product._id'
                    }
                }, {
                    $project: {
                        goodsNote: 1,
                        product  : 1,
                        orderRows: {
                            $filter: {
                                input: '$goodsNote.orderRows',
                                as   : 'item',
                                cond : {$eq: ['$$item.product', '$product']}
                            }
                        }
                    }
                }, {
                    $project: {
                        goodsNote: 1,
                        product  : 1,
                        orderRows: {$arrayElemAt: ['$orderRows', 0]}
                    }
                }, {
                    $lookup: {
                        from        : 'orderRows',
                        localField  : 'orderRows.orderRowId',
                        foreignField: '_id',
                        as          : 'orderRow'
                    }
                }, {
                    $project: {
                        goodsNote: 1,
                        product  : 1,
                        orderRow : {$arrayElemAt: ['$orderRow', 0]}
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    async.each(result, function (model, asyncCb) {
                        var date;
                        var startMonthDate;
                        var endMonthDate;
                        var product = model.product;
                        var goodsNote = model.goodsNote;
                        var orderRow = model.orderRow;
                        /* var creditAccount = orderRow ? orderRow.creditAccount : CONSTANTS.INVENTORY;
                         var debitAccount = orderRow ? orderRow.debitAccount : CONSTANTS.COGS;*/

                        var creditAccount = CONSTANTS.WORK_IN_PROCESS; // CONSTANTS.INVENTORY;
                        var debitAccount = CONSTANTS.COGS;

                        if (!goodsNote) {
                            return asyncCb();
                        }

                        if (!goodsNote.status || !goodsNote.status.shippedOn) {
                            return asyncCb();
                        }

                        date = moment(new Date(goodsNote.status.shippedOn));

                        Model.aggregate([{
                            $match: {
                                'sourceDocument._id'  : product,
                                'sourceDocument.model': 'product'
                            }
                        }, {
                            $group: {
                                _id   : null,
                                debit : {$sum: '$debit'},
                                credit: {$sum: '$credit'}
                            }
                        }], function (err, result) {
                            var bodyClosedJob;

                            if (err) {
                                return asyncCb(err);
                            }

                            bodyClosedJob = {
                                currency      : CONSTANTS.CURRENCY_USD,
                                journal       : null,
                                sourceDocument: {
                                    model: 'goodsOutNote',
                                    _id  : goodsNote._id,
                                    name : goodsNote.name
                                },

                                amount       : 0,
                                creditAccount: creditAccount,
                                debitAccount : debitAccount
                            };

                            bodyClosedJob.amount = result && result[0] ? result[0].debit || result[0].credit : 0;

                            bodyClosedJob.accountsItems = [{
                                debit  : bodyClosedJob.amount,
                                credit : 0,
                                account: debitAccount
                            }, {
                                debit  : 0,
                                credit : bodyClosedJob.amount,
                                account: creditAccount
                            }];

                            bodyClosedJob.date = new Date(date);

                            startMonthDate = moment(bodyClosedJob.date).startOf('month');
                            endMonthDate = moment(bodyClosedJob.date).endOf('month');

                            Model.update({
                                'sourceDocument._id'  : product,
                                'sourceDocument.model': 'product',
                                date                  : {
                                    $gte: new Date(startMonthDate),
                                    $lte: new Date(endMonthDate)
                                }
                            }, {$set: {date: new Date(bodyClosedJob.date)}}, {multi: true}, function (err, result) {
                                if (err) {
                                    return asyncCb(err);
                                }

                                if (bodyClosedJob.amount > 0) {
                                    Model.remove({'sourceDocument._id': goodsNote._id}, function (err, result) {
                                        if (err) {
                                            return asyncCb(err);
                                        }

                                        createMultiRows(bodyClosedJob, {
                                            dbName: req.session.lastDb,
                                            uId   : req.session.uId,
                                            cb    : asyncCb
                                        });
                                    });

                                } else {
                                    asyncCb();
                                }
                            });

                        });
                    }, function (err) {
                        if (err) {
                            return mainCb(err);
                        }
                        mainCb();
                    });
                });
            };

            recloseDaysFunc = function (mainCb) {
                if (!dontReclose) {
                    recloseDay(req, res, next, {startDate: date}, mainCb);
                } else {
                    mainCb();
                }
            };

            mainWaterfallTasks = [getJobsToCreateExpenses, parallelFunction, reconcileJobs, recloseDaysFunc];
            async.waterfall(mainWaterfallTasks, function (err) {
                var db;
                var setObj;

                if (err) {
                    return next(err);
                }
                db = models.connection(req.session.lastDb);
                setObj = {date: new Date()};

                console.log('Success');

                if (event) {
                    event.emit('sendMessage', {
                        view   : journalEntryCT,
                        message: 'Please, refresh browser, data was changed.',
                        dbName : dbName
                    });
                }

                if (cb && event) {
                    event.emit('sendMessage', {
                        view   : 'Projects',
                        message: 'Please, refresh browser, costs were calculated.',
                        dbName : dbName
                    });

                }

                Job.update({_id: {$in: jobIds}}, {$set: {reconcile: false}}, {multi: true}, function (err, result) {

                });

                db.collection('settings').update({name: 'reconcileDate'}, {$set: setObj}, {upsert: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    if (cb && typeof(cb) === 'function') {
                        cb();
                    }

                });
            });
        }

        this.getReconcileDate = function (req, res, next) {
            var db = models.connection(req.session.lastDb);

            db.collection('settings').findOne({name: 'reconcileDate'}, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result) {
                    res.status(200).send({date: result.date});
                } else {
                    res.status(200).send({date: new Date('14 Jul 2014')});
                }
            });
        };

        this.createManual = function (req, res, next) {
            var dbIndex = req.session.lastDb;
            var uId = req.session.uId;
            var Journal = models.get(dbIndex, 'journal', journalSchema);
            var Model = models.get(dbIndex, 'manualEntry', manualEntrySchema);
            var Currency = models.get(dbIndex, 'currency', CurrencySchema);
            var body = req.body;
            var now = moment();
            var date = body.date ? moment(new Date(body.date)) : now;
            var currency = body.currency;
            var rates;
            var waterfallTasks;
            var journalId = body.journal;
            var accountArray = body.accountsItems;
            var timeStamp = new Date();
            var timeStampDate = new Date(date);
            var fx = {};

            timeStamp = timeStamp.valueOf() + timeStampDate.valueOf();

            delete body.accountsItems;

            body.date = new Date(body.date);

            date = date.format('YYYY-MM-DD');

            function journalFinder(waterfallCb) {
                Journal.findById(journalId, waterfallCb);

            }

            function journalEntrySave(journal, waterfallCb) {
                var object;

                currency = {
                    name: currency._id,
                    rate: ratesRetriever.getRate(fx.rates, fx.base, currency.name)
                };

                body.currency = currency;
                body.journal = journal ? journal._id : null;
                body.timestamp = timeStamp;

                object = _.extend({}, body);

                async.each(accountArray, function (el, cb) {
                    var journalEntry;

                    object.debit = el.debit;
                    object.credit = el.credit;
                    object.account = el.account;

                    object.editedBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    object.createdBy = {
                        user: uId,
                        date: new Date(date)
                    };

                    object.debitFC = el.debitFC;
                    object.creditFC = el.creditFC;

                    if (object.debitFC === object.debit) {
                        object.debitFC = 0;
                    }

                    if (object.creditFC === object.credit) {
                        object.creditFC = 0;
                    }

                    if (el.debit || el.credit && moment(object.date).isBefore(now)) {
                        journalEntry = new Model(object);
                        journalEntry.save(cb);
                    } else {
                        cb();
                    }
                }, function (err) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, {success: true});
                });
            }

            function getRates(waterfallCb) {
                ratesService.getById({id: date, dbName: dbIndex}, function (err, result) {
                    if (err) {
                        return waterfallCb(err);
                    }
                    fx.rates = result && result.rates ? result.rates : {};
                    fx.base = result && result.base ? result.base : {};
                    waterfallCb();
                });
            }

            waterfallTasks = [getRates, journalFinder, journalEntrySave];

            async.waterfall(waterfallTasks, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });
        };

        this.getAsyncCloseMonth = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query;
            var date = query._id;
            var startDate = moment(new Date(date)).startOf('month');
            var endDate = moment(new Date(date)).endOf('month');

            if (!date) {
                return res.status(200).send({journalEntries: []});
            }

            Model.aggregate([{
                $match: {
                    'sourceDocument.model': 'closeMonth',
                    date                  : {$gte: new Date(startDate), $lte: new Date(endDate)}
                }
            }, {
                $project: {
                    date   : 1,
                    debit  : 1,
                    credit : 1,
                    journal: 1
                }
            }, {
                $group: {
                    _id   : '$journal',
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'},
                    date  : {$addToSet: '$date'}
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : '_id',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    _id    : 1,
                    date   : {$arrayElemAt: ['$date', 0]},
                    debit  : 1,
                    credit : 1,
                    journal: {$arrayElemAt: ['$journal', 0]}
                }
            }, {
                $sort: {
                    _id: -1
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({journalEntries: result});
            });
        };

        function matchEditor(account, match) {
            var accountName = matchObject[account];

            if (accountName) {
                match[accountName] = {$gt: 0};
            }

            return match;
        }

        this.getAsyncForBalanceSheet = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query || {};
            var filter = query.filter;
            var category = query.category;
            var match = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });

            Model.aggregate([{
                    $match: match
                }, {
                    $group: {
                        _id   : '$account',
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : '_id'
                    }
                }, {
                    $project: {
                        account: {$arrayElemAt: ['$_id', 0]},
                        debit  : 1,
                        credit : 1
                    }
                }, {
                    $match: {
                        'account.category': objectId(category)
                    }
                }],
                function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({data: result});
                }
            );
        };

        this.getAsyncDataForGL = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query || {};
            var account = query._id;
            var category = query.category;
            var filter = query.filter;
            /*var startDate = query.startDate;
             var endDate = query.endDate;*/
            var contentType = query.contentType;
            var match;
            var secondMatch = {};

            /*startDate = moment(new Date(startDate)).startOf('day');
             endDate = moment(new Date(endDate)).endOf('day');*/

            var match = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });

            if (!category) {
                if (!account || account.length < 24) {
                    return res.status(400).send();
                }
            }

            if (account) {
                match.account = objectId(account);
            } else if (category) {
                secondMatch = {
                    'accountLookuped.category': objectId(category)
                };
            }

            if (!contentType) {
                match = matchEditor(account, match);
            }

            if (!account && !category) {
                return res.status(200).send({journalEntries: []});
            }

            /* if (account === CONSTANTS.FINISHED_GOODS){
             match.journal = objectId(CONSTANTS.CLOSED_JOB);
             }

             if (account === CONSTANTS.ACCOUNT_RECEIVABLE){
             match.journal = objectId(CONSTANTS.INVOICE_JOURNAL);
             }*/

            Model.aggregate([{
                $match: match
            }, {
                $project: {
                    sourceDocument: 1,
                    date          : 1,
                    debit         : 1,
                    credit        : 1,
                    account       : 1
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'accountLookuped'
                }
            }, {
                $project: {
                    sourceDocument : 1,
                    date           : 1,
                    debit          : 1,
                    credit         : 1,
                    account        : 1,
                    accountLookuped: {$arrayElemAt: ['$accountLookuped', 0]}
                }
            }, {
                $match: secondMatch
            }, {
                $project: {
                    _id           : '$date',
                    sourceDocument: 1,
                    debit         : 1,
                    credit        : 1,
                    account       : 1,
                    category      : '$accountLookuped.category'
                }
            }, {
                $sort: {
                    _id: -1
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({journalEntries: result});
            });

        };

        this.getSourceForDd = function (req, res, next) {
            var dbName = req.session.lastDb;
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var Employees = models.get(dbName, 'Employees', employeeSchema);
            var Invoice = models.get(dbName, 'wTrackInvoice', invoiceSchema);
            var Job = models.get(dbName, 'jobs', jobsSchema);
            var Payment = models.get(dbName, 'InvoicePayment', InvoicePaymentSchema);
            var parallelTasks;

            function getEmployees(pCB) {
                Employees.aggregate([{
                    $project: {
                        name: {$concat: ['$name.first', ' ', '$name.last']},
                        type: {$concat: ['', 'Employees']}
                    }
                }], function (err, result) {
                    if (err) {
                        return pCB(err);
                    }

                    pCB(null, result);
                });
            }

            function getJobs(pCB) {
                Job.aggregate([{
                    $project: {
                        name: 1,
                        type: {$concat: ['', 'jobs']}
                    }
                }], function (err, result) {
                    if (err) {
                        return pCB(err);
                    }

                    pCB(null, result);
                });
            }

            function getInvoice(pCB) {
                Invoice.aggregate([{
                    $project: {
                        name: 1,
                        type: '$_type'
                    }
                }], function (err, result) {
                    if (err) {
                        return pCB(err);
                    }

                    pCB(null, result);
                });
            }

            function getPayments(pCB) {
                Payment.aggregate([{
                    $project: {
                        name: 1,
                        type: '$_type'
                    }
                }], function (err, result) {
                    if (err) {
                        return pCB(err);
                    }

                    pCB(null, result);
                });
            }

            parallelTasks = [getEmployees, getJobs, getInvoice, getPayments];

            async.parallel(parallelTasks, function (err, result) {
                var data = [];

                if (err) {
                    return next(err);
                }

                data = _.union(result[0], result[1], result[2], result[3]);

                res.status(200).send({data: data});
            });
        };

        this.getAsyncData = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query;
            var sourceDocument = query._id;
            var date = query.date;
            var product;
            var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

            Product.findOne({job: sourceDocument}, {_id: 1}, function (err, result) {
                if (err) {
                    return next(err);
                }

                product = result ? result._id : null;

                Model
                    .aggregate([{
                        $match: {
                            'sourceDocument._id': objectId(product),
                            date                : new Date(date)
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'account',
                            foreignField: '_id',
                            as          : 'account'
                        }
                    }, {
                        $lookup: {
                            from        : 'journals',
                            localField  : 'journal',
                            foreignField: '_id',
                            as          : 'journal'
                        }
                    }, {
                        $lookup: {
                            from        : 'currency',
                            localField  : 'currency._id',
                            foreignField: '_id',
                            as          : 'currency._id'
                        }
                    }, {
                        $project: {
                            journal        : {$arrayElemAt: ['$journal', 0]},
                            account        : {$arrayElemAt: ['$account', 0]},
                            'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                            sourceDocument : 1,
                            'currency.name': 1,
                            debit          : 1,
                            credit         : 1,
                            debitFC        : 1,
                            creditFC       : 1,
                            date           : 1,
                            timestamp      : 1,
                            createdBy      : 1,
                            _type          : 1
                        }
                    }, {
                        $project: {
                            'account._id' : 1,
                            'account.name': 1,
                            'journal.name': '$journal.name',
                            'journal._id' : '$journal._id',
                            sourceDocument: 1,
                            currency      : 1,
                            debit         : 1,
                            credit        : 1,
                            debitFC       : 1,
                            creditFC      : 1,
                            date          : 1,
                            timestamp     : 1,
                            createdBy     : 1,
                            _type         : 1
                        }
                    }], function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({journalEntries: result});
                    });
            });
        };

        this.getCloseMonth = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var closeMonth = CONSTANTS.CLOSE_MONTH_JOURNALS;

            Model.aggregate([{
                $match: {
                    'sourceDocument.model': 'closeMonth'
                    // journal: {$in: closeMonth.objectID()}
                }
            }, {
                $group: {
                    _id: '$date'
                }
            }, {
                $sort: {
                    _id: 1
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        };

        this.getBalanceSheet = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var getCurrentAssets;
            var getFixedAssets;
            var getLiabilities;
            var getEquities;
            var query = req.query || {};
            var filter = query.filter;
            var dateObject = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            var startDate = filter.date && filter.date.value && filter.date.value.length && filter.date.value[0];
            var endDate = filter.date && filter.date.value && filter.date.value.length && filter.date.value[1];
            var liabilities = CONSTANTS.LIABILITIES;
            var equity = CONSTANTS.EQUITY.objectID();
            var currentAssets = [CONSTANTS.ACCOUNT_RECEIVABLE, CONSTANTS.WORK_IN_PROCESS, CONSTANTS.FINISHED_GOODS];
            var CategorySchema = mongoose.Schemas.accountsCategory;
            var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);
            var ASSETS = '584aa1e84881bdc437c60828';
            var FIXED_ASSETS = '5810c75b2b225158086d7f82';
            var CURRENT_ASSETS = '5810c75b2b225158086d7f80';

            var aggregate;
            var dateCondition;

            startDate = new Date(moment(new Date(startDate)).startOf('day'));
            endDate = new Date(moment(new Date(endDate)).endOf('day'));

            dateCondition = [{
                $gte: ['$$item.date', new Date(startDate)]
            }, {
                $lte: ['$$item.date', new Date(endDate)]
            }];

            req.dateCondition = {date: {$lte: new Date(endDate)}};

            liabilities.push(CONSTANTS.ACCOUNT_PAYABLE);
            liabilities = liabilities.objectID();

            getCurrentAssets = function (cb) {
                aggregate = [{
                    $match: {
                        _id: objectId(CURRENT_ASSETS)
                    }
                }, {
                    $project: {
                        _id  : 1,
                        name : 1,
                        child: {$concatArrays: ['$child', ['$_id']]}
                    }
                }, {
                    $unwind: {
                        path                      : '$child',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'child',
                        foreignField: 'category',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'accountsCategories',
                        localField  : 'child',
                        foreignField: '_id',
                        as          : 'category'
                    }
                }, {
                    $project: {
                        category  : {$arrayElemAt: ['$category', 0]},
                        account   : 1,
                        _id       : '$name',
                        categoryId: '$_id'
                    }
                }, {
                    $unwind: {
                        path                      : '$account',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $sort: {'category.nestingLevel': 1, 'account.name': 1}
                }, {
                    $lookup: {
                        from        : 'journalentries',
                        localField  : 'account._id',
                        foreignField: 'account',
                        as          : 'entries'
                    }
                }, {
                    $project: {
                        category  : 1,
                        account   : 1,
                        _id       : 1,
                        categoryId: 1,
                        entries   : {
                            $filter: {
                                input: '$entries',
                                as   : 'item',
                                cond : {
                                    $and: dateCondition
                                }
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$entries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id       : '$category',
                        debit     : {$sum: '$entries.debit'},
                        credit    : {$sum: '$entries.credit'},
                        categoryId: {$first: '$categoryId'},
                        account   : {$first: '$account'},
                        acc       : {$first: '$_id'}
                    }
                }, {
                    $project: {
                        'category._id'         : '$_id._id',
                        'category.name'        : '$_id.name',
                        'category.nestingLevel': '$_id.nestingLevel',
                        'category.sequence'    : '$_id.sequence',
                        'category.parent'      : '$_id.parent',
                        'category.debit'       : '$debit',
                        'category.credit'      : '$credit',
                        account                : 1,
                        debit                  : 1,
                        credit                 : 1,
                        categoryId             : 1,
                        acc                    : 1,
                        group                  : {$concat: ['assets']},
                        entries                : 1
                    }
                }, {
                    $sort: {
                        'category.nestingLevel': 1
                    }
                }, {
                    $group: {
                        _id         : '$acc',
                        debit       : {$sum: '$debit'},
                        credit      : {$sum: '$credit'},
                        categoryId  : {$first: '$categoryId'},
                        root        : {$push: '$category'},
                        nestingLevel: {$max: '$category.nestingLevel'},
                        group       : {$first: '$group'}
                    }
                }, {
                    $sort: {group: 1}
                }];

                AccountsCategory.aggregate(aggregate, function (err, resultArr) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, resultArr);
                });
            };

            getFixedAssets = function (cb) {
                aggregate = [{
                    $match: {
                        _id: objectId(FIXED_ASSETS)
                    }
                }, {
                    $project: {
                        _id  : 1,
                        name : 1,
                        child: {$concatArrays: ['$child', ['$_id']]}
                    }
                }, {
                    $unwind: {
                        path                      : '$child',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'child',
                        foreignField: 'category',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'accountsCategories',
                        localField  : 'child',
                        foreignField: '_id',
                        as          : 'category'
                    }
                }, {
                    $project: {
                        category  : {$arrayElemAt: ['$category', 0]},
                        account   : 1,
                        _id       : '$name',
                        categoryId: '$_id'
                    }
                }, {
                    $unwind: {
                        path                      : '$account',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $sort: {'category.nestingLevel': 1, 'account.name': 1}
                }, {
                    $lookup: {
                        from        : 'journalentries',
                        localField  : 'account._id',
                        foreignField: 'account',
                        as          : 'entries'
                    }
                }, {
                    $project: {
                        category  : 1,
                        account   : 1,
                        _id       : 1,
                        categoryId: 1,
                        entries   : {
                            $filter: {
                                input: '$entries',
                                as   : 'item',
                                cond : {
                                    $and: dateCondition
                                }
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$entries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id       : '$category',
                        debit     : {$sum: '$entries.debit'},
                        credit    : {$sum: '$entries.credit'},
                        categoryId: {$first: '$categoryId'},
                        account   : {$first: '$account'},
                        acc       : {$first: '$_id'}
                    }
                }, {
                    $project: {
                        'category._id'         : '$_id._id',
                        'category.name'        : '$_id.name',
                        'category.nestingLevel': '$_id.nestingLevel',
                        'category.sequence'    : '$_id.sequence',
                        'category.parent'      : '$_id.parent',
                        'category.debit'       : '$debit',
                        'category.credit'      : '$credit',
                        account                : 1,
                        debit                  : 1,
                        credit                 : 1,
                        categoryId             : 1,
                        acc                    : 1,
                        group                  : {$concat: ['assets']},
                        entries                : 1
                    }
                }, {
                    $sort: {
                        'category.nestingLevel': 1
                    }
                }, {
                    $group: {
                        _id         : '$acc',
                        debit       : {$sum: '$debit'},
                        credit      : {$sum: '$credit'},
                        categoryId  : {$first: '$categoryId'},
                        root        : {$push: '$category'},
                        nestingLevel: {$max: '$category.nestingLevel'},
                        group       : {$first: '$group'}
                    }
                }, {
                    $sort: {group: 1}
                }];

                AccountsCategory.aggregate(aggregate, function (err, resultArr) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, resultArr);
                });
            };

            getLiabilities = function (cb) {
                aggregate = [{
                    $match: {
                        _id: LIABILITIES
                    }
                }, {
                    $project: {
                        _id  : 1,
                        name : 1,
                        child: {$concatArrays: ['$child', ['$_id']]}
                    }
                }, {
                    $unwind: {
                        path                      : '$child',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'child',
                        foreignField: 'category',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'accountsCategories',
                        localField  : 'child',
                        foreignField: '_id',
                        as          : 'category'
                    }
                }, {
                    $project: {
                        category  : {$arrayElemAt: ['$category', 0]},
                        account   : 1,
                        _id       : '$name',
                        categoryId: '$_id'
                    }
                }, {
                    $unwind: {
                        path                      : '$account',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'journalentries',
                        localField  : 'account._id',
                        foreignField: 'account',
                        as          : 'entries'
                    }
                }, {
                    $project: {
                        category  : 1,
                        account   : 1,
                        _id       : 1,
                        categoryId: 1,
                        entries   : {
                            $filter: {
                                input: '$entries',
                                as   : 'item',
                                cond : {
                                    $and: dateCondition
                                }
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$entries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id       : '$category',
                        debit     : {$sum: '$entries.debit'},
                        credit    : {$sum: '$entries.credit'},
                        categoryId: {$first: '$categoryId'},
                        account   : {$first: '$account'},
                        acc       : {$first: '$_id'}
                    }
                }, {
                    $project: {
                        'category._id'         : '$_id._id',
                        'category.name'        : '$_id.name',
                        'category.nestingLevel': '$_id.nestingLevel',
                        'category.parent'      : '$_id.parent',
                        'category.debit'       : '$debit',
                        'category.credit'      : '$credit',
                        account                : 1,
                        debit                  : 1,
                        credit                 : 1,
                        categoryId             : 1,
                        acc                    : 1,
                        group                  : {$concat: ['liabilities']},
                        entries                : 1
                    }
                }, {
                    $group: {
                        _id         : '$acc',
                        debit       : {$sum: '$debit'},
                        credit      : {$sum: '$credit'},
                        categoryId  : {$first: '$categoryId'},
                        root        : {$push: '$category'},
                        nestingLevel: {$max: '$category.nestingLevel'},
                        group       : {$first: '$group'}
                    }
                }, {
                    $sort: {group: 1}
                }];

                AccountsCategory.aggregate(aggregate, function (err, resultArr) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, resultArr);
                });
            };

            getEquities = function (cb) {
                aggregate = [{
                    $match: {
                        _id: EQUITY
                    }
                }, {
                    $project: {
                        _id  : 1,
                        name : 1,
                        child: {$concatArrays: ['$child', ['$_id']]}
                    }
                }, {
                    $unwind: {
                        path                      : '$child',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'child',
                        foreignField: 'category',
                        as          : 'account'
                    }
                }, {
                    $lookup: {
                        from        : 'accountsCategories',
                        localField  : 'child',
                        foreignField: '_id',
                        as          : 'category'
                    }
                }, {
                    $project: {
                        category  : {$arrayElemAt: ['$category', 0]},
                        account   : 1,
                        _id       : '$name',
                        categoryId: '$_id'
                    }
                }, {
                    $unwind: {
                        path                      : '$account',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'journalentries',
                        localField  : 'account._id',
                        foreignField: 'account',
                        as          : 'entries'
                    }
                }, {
                    $project: {
                        category  : 1,
                        account   : 1,
                        _id       : 1,
                        categoryId: 1,
                        entries   : {
                            $filter: {
                                input: '$entries',
                                as   : 'item',
                                cond : {
                                    $and: dateCondition
                                }
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$entries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id       : '$category',
                        debit     : {$sum: '$entries.debit'},
                        credit    : {$sum: '$entries.credit'},
                        categoryId: {$first: '$categoryId'},
                        account   : {$first: '$account'},
                        acc       : {$first: '$_id'}
                    }
                }, {
                    $project: {
                        'category._id'         : '$_id._id',
                        'category.name'        : '$_id.name',
                        'category.nestingLevel': '$_id.nestingLevel',
                        'category.parent'      : '$_id.parent',
                        'category.debit'       : '$debit',
                        'category.credit'      : '$credit',
                        account                : 1,
                        debit                  : 1,
                        credit                 : 1,
                        categoryId             : 1,
                        acc                    : 1,
                        group                  : {$concat: ['equity']},
                        entries                : 1
                    }
                }, {
                    $group: {
                        _id         : '$acc',
                        debit       : {$sum: '$debit'},
                        credit      : {$sum: '$credit'},
                        categoryId  : {$first: '$categoryId'},
                        root        : {$push: '$category'},
                        nestingLevel: {$max: '$category.nestingLevel'},
                        group       : {$first: '$group'}
                    }
                }, {
                    $sort: {group: 1}
                }];

                AccountsCategory.aggregate(aggregate, function (err, resultArr) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, resultArr);
                });
            };

            async.parallel([getCurrentAssets, getFixedAssets, getLiabilities, getEquities], function (err, result) {
                var newLiabilities;

                if (err) {
                    return next(err);
                }

                newLiabilities = result[2] || [];

                getProfitAndLoss(req, null, null, function (err, resultArray) {
                    var sum = 0;
                    if (err) {
                        return next(err);
                    }

                    console.log(resultArray);

                    sum = resultArray && resultArray.length ? resultArray[0].debit : 0;

                    for (var i = resultArray.length - 1; i > 0; i--) {
                        if (resultArray[i].debit) {
                            sum -= resultArray[i].debit;
                        }
                    }

                    res.status(200).send({
                        currentAssets: result[0],
                        fixedAssets  : result[1],
                        liabilities  : newLiabilities,
                        equity       : result[3],
                        sum          : sum
                    });
                });
            });
        };

        this.taxReport = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query;
            var filter = query.filter;
            var dateObject = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            OrganizationService.getDefaultTaxes({dbName: req.session.lastDb, both: true}, function (err, taxes) {
                var accounts;
                if (err) {
                    return next(err);
                }

                accounts = [taxes.salesTax, taxes.purchaseTax, taxes.payableTax, taxes.carriedTax];

                Model.aggregate([{
                    $match: {
                        account: {$in: accounts}
                    }
                }, {
                    $match: dateObject
                }, {
                    $project: {
                        debit  : 1,
                        credit : 1,
                        date   : 1,
                        account: 1
                    }
                }, {
                    $group: {
                        _id   : '$account',
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        debit  : 1,
                        credit : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $project: {
                        debit         : 1,
                        credit        : 1,
                        'account.name': 1,
                        'account._id' : 1
                    }
                }], function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            });
        };

        this.getBalanceForAccount = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query;
            var account = query.account;
            var date = query.date;

            date = moment(new Date(date)).endOf('day');

            Model.aggregate([{
                $match: {
                    account: objectId(account),
                    date   : {
                        $lte: new Date(date)
                    }
                }
            }, {
                $project: {
                    date   : 1,
                    debit  : {$divide: ['$debit', '$currency.rate']},
                    credit : {$divide: ['$credit', '$currency.rate']},
                    account: 1
                }
            }, {
                $group: {
                    _id   : '$account',
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'}
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({maxAmount: result && result.length ? result[0].debit - result[0].credit : 0})
            });

        };

        this.getExpenses = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
            var query = req.query;
            var month = parseInt(query.month, 10);
            var year = parseInt(query.year, 10);
            var startDate = moment().year(year).month(month - 1).startOf('month');
            var endDate = moment(startDate).endOf('month');
            var parallelTasks;

            var adminExpenses = function (cb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                        'sourceDocument.model': 'expensesInvoice',
                        debit                 : {$gt: 0}
                    }
                }, {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: '$debit'
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result && result.length ? result[0].sum : 0);
                });
            };

            var vacationExpenses = function (cb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                        'sourceDocument.model': 'Employees',
                        journal               : objectId(CONSTANTS.VACATION_PAYABLE),
                        credit                : {$gt: 0}
                    }
                }, {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: '$credit'
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result && result.length ? result[0].sum : 0);
                });
            };

            var idleExpenses = function (cb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                        'sourceDocument.model': 'Employees',
                        journal               : objectId(CONSTANTS.IDLE_PAYABLE),
                        credit                : {$gt: 0}
                    }
                }, {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: '$credit'
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result && result.length ? result[0].sum : 0);
                });
            };

            var adminSalary = function (cb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                        'sourceDocument.model': 'Employees',
                        journal               : objectId(CONSTANTS.ADMIN_SALARY_JOURNAL),
                        credit                : {$gt: 0}
                    }
                }, {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: '$credit'
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result && result.length ? result[0].sum : 0);
                });
            };

            var actualHours = function (cb) {
                wTrack.aggregate([{
                    $match: {
                        month: month,
                        year : year
                    }
                }, {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: '$worked'
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result && result.length ? result[0].sum : 0);
                });
            };

            var marketingExpenses = function (cb) {
                Model.aggregate([{
                    $match: {
                        date                  : {$gte: new Date(startDate), $lte: new Date(endDate)},
                        'sourceDocument.model': 'writeOff',
                        journal               : objectId(CONSTANTS.WRITE_OFF),
                        credit                : {$gt: 0}
                    }
                }, {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: '$credit'
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result && result.length ? result[0].sum : 0);
                });
            };

            parallelTasks = {
                adminExpenses   : adminExpenses,
                vacationExpenses: vacationExpenses,
                idleExpenses    : idleExpenses,
                adminSalary     : adminSalary,
                actualHours     : actualHours,
                marketingBudget : marketingExpenses
            };

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

        };

        this.getInventoryReport = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var JobsModel = models.get(req.session.lastDb, 'jobs', jobsSchema);
            var query = req.query;
            var findJobs;
            var composeReport;
            var waterfallTasks;
            var sort = {name: 1};
            var paginationObject = pageHelper(query);
            var limit = paginationObject.limit;
            var skip = paginationObject.skip;
            var filter = query.filter || {};
            var dateObject = filterMapper.mapFilter(filter, {
                contentType: 'inventoryReport',
                keysArray  : 'date'
            });
            var filterObjectNoDate = filterMapper.mapFilter(filter, {
                contentType : 'inventoryReport',
                keysArray   : 'date',
                withoutState: true
            });
            var key;
            var sortKey;
            var i;
            var startDate = filter.date && filter.date.value && filter.date.value.length && filter.date.value[0];
            var debitAccounts;
            var creditAccounts;
            var accounts;
            var goodsNotes;

            startDate = new Date(startDate);

            if (query.sort) {
                sort = {};
                sortKey = Object.keys(query.sort);

                for (i = sortKey.length - 1; i >= 0; i--) {
                    key = sortKey[i];
                    sort[key] = parseInt(query.sort[key], 10);
                }
            }

            findJobs = function (wfCb) {
                JobsModel.aggregate([{
                    $lookup: {
                        from        : 'Products',
                        localField  : '_id',
                        foreignField: 'job',
                        as          : 'products'
                    }
                }, {
                    $lookup: {
                        from        : 'GoodsNote',
                        localField  : 'order',
                        foreignField: 'order',
                        as          : 'goodsNote'
                    }
                }, {
                    $project: {
                        goodsNote: {$arrayElemAt: ['$goodsNote', 0]},
                        products : 1
                    }
                }, {
                    $project: {
                        orderRows: '$goodsNote.orderRows',
                        goodsId  : '$goodsNote._id',
                        products : 1
                    }
                }, {
                    $unwind: {
                        path                      : '$orderRows',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'orderRows',
                        localField  : 'orderRows.orderRowId',
                        foreignField: '_id',
                        as          : 'orderRow'
                    }
                }, {
                    $project: {
                        orderRow: {$arrayElemAt: ['$orderRow', 0]},
                        products: 1,
                        goodsId : 1
                    }
                }, {
                    $project: {
                        orderRow      : 1,
                        products      : 1,
                        goodsId       : 1,
                        debitAccounts : '$orderRow.debitAccount',
                        creditAccounts: '$orderRow.creditAccount'
                    }
                }, {
                    $unwind: {
                        path                      : '$products',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id           : null,
                        products      : {$addToSet: '$products._id'},
                        debitAccounts : {$addToSet: '$debitAccounts'},
                        creditAccounts: {$addToSet: '$creditAccounts'},
                        goodsId       : {$addToSet: '$goodsId'}
                    }
                }], function (err, result) {
                    var products;

                    if (err) {
                        return wfCb(err);
                    }

                    products = result && result.length ? result[0].products : [];
                    debitAccounts = result && result.length ? result[0].debitAccounts.objectID() : [];
                    creditAccounts = result && result.length ? result[0].creditAccounts.objectID() : [];

                    goodsNotes = result && result.length ? result[0].goodsId.objectID() : [];

                    accounts = debitAccounts.concat(creditAccounts);

                    wfCb(null, products);
                });
            };

            composeReport = function (products, wfCb) {
                var parallelTasks;

                var getOpening = function (pCb) {
                    Model.aggregate([{
                        $match: {
                            date                  : {$lte: startDate},
                            debit                 : {$gt: 0},
                            'sourceDocument._id'  : {$in: products},
                            'sourceDocument.model': 'product'
                        }
                    }, {
                        $project: {
                            sourceDocument: 1,
                            debit         : 1
                        }
                    }, {
                        $group: {
                            _id  : '$sourceDocument._id',
                            debit: {$sum: '$debit'}
                        }
                    }, {
                        $lookup: {
                            from        : 'Products',
                            localField  : '_id',
                            foreignField: '_id',
                            as          : '_id'
                        }
                    }, {
                        $project: {
                            _id  : {$arrayElemAt: ['$_id', 0]},
                            debit: 1
                        }
                    }, {
                        $match: {
                            '_id.job': {$exists: true}
                        }
                    }, {
                        $lookup: {
                            from        : 'jobs',
                            localField  : '_id.job',
                            foreignField: '_id',
                            as          : '_id.job'
                        }
                    }, {
                        $project: {
                            '_id.job' : {$arrayElemAt: ['$_id.job', 0]},
                            '_id.name': 1,
                            '_id._id' : 1,
                            debit     : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'projectMembers',
                            localField  : '_id.job.project',
                            foreignField: 'projectId',
                            as          : 'projectMembers'
                        }
                    }, {
                        $lookup: {
                            from        : 'Project',
                            localField  : '_id.job.project',
                            foreignField: '_id',
                            as          : 'project'
                        }
                    }, {
                        $project: {
                            _id    : '$_id._id',
                            name   : '$_id.name',
                            project: {$arrayElemAt: ['$project', 0]},
                            debit  : 1,

                            salesManagers: {
                                $filter: {
                                    input: '$projectMembers',
                                    as   : 'projectMember',
                                    cond : {
                                        $and: [{
                                            $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                        }, {
                                            $eq: ['$$projectMember.endDate', null]
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $project: {
                            salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesManager.employeeId',
                            foreignField: '_id',
                            as          : 'salesManager'
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1,
                            salesmanager: {$arrayElemAt: ['$salesManager', 0]}
                        }
                    }, {
                        $match: filterObjectNoDate
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1,
                            salesmanager: {$concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']}
                        }
                    }], function (err, result) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, result || []);
                    });
                };

                var getInwards = function (pCb) {
                    Model.aggregate([{
                        $match: dateObject
                    }, {
                        $match: {
                            debit                 : {$gt: 0},
                            'sourceDocument._id'  : {$in: products},
                            'sourceDocument.model': 'product'
                        }
                    }, {
                        $project: {
                            sourceDocument: 1,
                            debit         : 1
                        }
                    }, {
                        $group: {
                            _id  : '$sourceDocument._id',
                            debit: {$sum: '$debit'}
                        }
                    }, {
                        $lookup: {
                            from        : 'Products',
                            localField  : '_id',
                            foreignField: '_id',
                            as          : '_id'
                        }
                    }, {
                        $project: {
                            _id  : {$arrayElemAt: ['$_id', 0]},
                            debit: 1
                        }
                    }, {
                        $match: {
                            '_id.job': {$exists: true}
                        }
                    }, {
                        $lookup: {
                            from        : 'jobs',
                            localField  : '_id.job',
                            foreignField: '_id',
                            as          : '_id.job'
                        }
                    }, {
                        $project: {
                            '_id.job' : {$arrayElemAt: ['$_id.job', 0]},
                            '_id.name': 1,
                            '_id._id' : 1,
                            debit     : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'projectMembers',
                            localField  : '_id.job.project',
                            foreignField: 'projectId',
                            as          : 'projectMembers'
                        }
                    }, {
                        $lookup: {
                            from        : 'Project',
                            localField  : '_id.job.project',
                            foreignField: '_id',
                            as          : 'project'
                        }
                    }, {
                        $project: {
                            _id    : '$_id._id',
                            name   : '$_id.name',
                            project: {$arrayElemAt: ['$project', 0]},
                            debit  : 1,

                            salesManagers: {
                                $filter: {
                                    input: '$projectMembers',
                                    as   : 'projectMember',
                                    cond : {
                                        $and: [{
                                            $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                        }, {
                                            $eq: ['$$projectMember.endDate', null]
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $project: {
                            salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesManager.employeeId',
                            foreignField: '_id',
                            as          : 'salesManager'
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1,
                            salesmanager: {$arrayElemAt: ['$salesManager', 0]}
                        }
                    }, {
                        $match: filterObjectNoDate
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1,
                            salesmanager: {$concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']}
                        }
                    }], function (err, result) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, result || []);
                    });
                };

                var getOutwards = function (pCb) {
                    Model.aggregate([{
                        $match: dateObject
                    }, {
                        $match: {
                            debit               : {$gt: 0},
                            'sourceDocument._id': {$in: goodsNotes}
                        }
                    }, {
                        $project: {
                            sourceDocument: 1,
                            debit         : 1
                        }
                    }, {
                        $group: {
                            _id  : '$sourceDocument._id',
                            debit: {$sum: '$debit'}
                        }
                    }, {
                        $lookup: {
                            from        : 'GoodsNote',
                            localField  : '_id',
                            foreignField: '_id',
                            as          : '_id'
                        }
                    }, {
                        $project: {
                            _id  : {$arrayElemAt: ['$_id', 0]},
                            debit: 1
                        }
                    }, {
                        $project: {
                            order: '$_id.order',
                            debit: 1
                        }
                    }, {
                        $lookup: {
                            from        : 'jobs',
                            localField  : 'order',
                            foreignField: 'order',
                            as          : '_id.job'
                        }
                    }, {
                        $unwind: {
                            path                      : '$_id.job',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: {
                            '_id.job': {$exists: true}
                        }
                    }, {
                        $lookup: {
                            from        : 'Products',
                            localField  : '_id.job._id',
                            foreignField: 'job',
                            as          : 'product'
                        }
                    }, {
                        $lookup: {
                            from        : 'jobs',
                            localField  : '_id.job',
                            foreignField: '_id',
                            as          : '_id.job'
                        }
                    }, {
                        $project: {
                            '_id.job' : {$arrayElemAt: ['$_id.job', 0]},
                            product   : {$arrayElemAt: ['$product', 0]},
                            '_id.name': 1,
                            '_id._id' : 1,
                            debit     : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'projectMembers',
                            localField  : '_id.job.project',
                            foreignField: 'projectId',
                            as          : 'projectMembers'
                        }
                    }, {
                        $lookup: {
                            from        : 'Project',
                            localField  : '_id.job.project',
                            foreignField: '_id',
                            as          : 'project'
                        }
                    }, {
                        $project: {
                            _id    : '$product._id',
                            product: 1,
                            name   : '$_id.product.name',
                            project: {$arrayElemAt: ['$project', 0]},
                            debit  : 1,

                            salesManagers: {
                                $filter: {
                                    input: '$projectMembers',
                                    as   : 'projectMember',
                                    cond : {
                                        $and: [{
                                            $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                        }, {
                                            $eq: ['$$projectMember.endDate', null]
                                        }]
                                    }
                                }
                            }
                        }
                    }, {
                        $project: {
                            salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesManager.employeeId',
                            foreignField: '_id',
                            as          : 'salesManager'
                        }
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1,
                            salesmanager: {$arrayElemAt: ['$salesManager', 0]}
                        }
                    }, {
                        $match: filterObjectNoDate
                    }, {
                        $project: {
                            _id         : 1,
                            name        : 1,
                            project     : 1,
                            debit       : 1,
                            salesmanager: {$concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']}
                        }
                    }], function (err, result) {
                        if (err) {
                            return pCb(err);
                        }

                        pCb(null, result || []);
                    });
                };

                parallelTasks = [getOpening, getInwards, getOutwards];

                async.parallel(parallelTasks, function (err, result) {
                    var resultArray = [];
                    var sortField;
                    var total;

                    if (err) {
                        return wfCb(err);
                    }

                    resultArray = [];
                    sortField = Object.keys(sort)[0];

                    products.forEach(function (el) { // need refactor on aggregate function
                        var newElement = {};
                        var project;

                        var opening = _.find(result[0], function (elem) {
                            return elem._id.toString() === el.toString();
                        });
                        var inwards = _.find(result[1], function (elem) {
                            return elem._id.toString() === el.toString();
                        });
                        var outwards = _.find(result[2], function (elem) {
                            return elem._id.toString() === el.toString();
                        });

                        newElement._id = el;
                        newElement.name = opening ? opening.name : (inwards ? inwards.name : outwards ? outwards.name : '');

                        project = opening ? opening.project : (inwards ? inwards.project : outwards ? outwards.name : {});
                        newElement.salesmanager = opening ? opening.salesmanager : (inwards ? inwards.salesmanager : outwards ? outwards.salesmanager : '');

                        newElement.project = project ? project._id : null;
                        newElement.projectName = project ? project.name : '-----';
                        newElement.projecttype = project ? project.projecttype : '-----';

                        newElement.openingBalance = opening ? opening.debit / 100 : 0;
                        newElement.inwards = inwards ? inwards.debit / 100 : 0;
                        newElement.outwards = outwards ? outwards.debit / 100 : 0;
                        newElement.closingBalance = newElement.openingBalance + newElement.inwards - newElement.outwards;

                        if (newElement.name && !(outwards && outwards.date < startDate)) {
                            if (!Object.keys(filter)) {
                                resultArray.push(newElement);
                            } else {
                                if (newElement.inwards || newElement.outwards) {
                                    resultArray.push(newElement);
                                }
                            }
                        }
                    });

                    if (sortField) { // need refactor on aggregate function
                        resultArray = resultArray.sort(function (a, b) {
                            function compareField(elA, elB) {
                                if (elA[sortField] > elB[sortField]) {
                                    return 1;
                                } else if (elA[sortField] < elB[sortField]) {
                                    return -1;
                                }
                                return 0;
                            }

                            if (sort[sortField] === 1) {
                                return compareField(a, b);
                            }

                            return compareField(b, a);
                        });
                    }

                    total = resultArray.length;
                    resultArray = resultArray.slice(skip, skip + limit); // need refactor on aggregate function

                    wfCb(null, {total: total, data: resultArray});
                });
            };

            waterfallTasks = [findJobs, composeReport];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

        };

        this.getCashFlow = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var getOperating;
            var getInvesting;
            var getFinancing;
            var query = req.query || {};
            var filter = query.filter;
            var liabilities = CONSTANTS.LIABILITIES;
            var dateObject = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            var startDate = filter.date ? new Date(moment(new Date(filter.date.value[0])).startOf('day')) : moment();
            var endDate = filter.date ? new Date(moment(new Date(filter.date.value[1])).endOf('day')) : moment();

            liabilities.push(CONSTANTS.ACCOUNT_PAYABLE);
            liabilities = liabilities.objectID();

            var operatingReceivable = ['5810c75b2b225158086d7f87', '595372371e032d742ac2c0f0', '595372791e032d742ac2c0f3'];
            var operatingPayable = ['59537ecae5ad8c242e9e6dae', '59537eb6e5ad8c242e9e6dad', '5810c75b2b225158086d7f86'];

            getOperating = function (cb) {

                Model.aggregate([{
                        $match: {
                            date: {$lte: endDate}
                        }
                    }, {
                        $group: {
                            _id : '$account',
                            root: {$push: '$$ROOT'}
                        }
                    }, {
                        $project: {
                            startPeriod: {
                                $filter: {
                                    input: '$root',
                                    as   : 'item',
                                    cond : {$lt: ['$$item.date', startDate]}
                                }
                            },

                            endPeriod: {
                                $filter: {
                                    input: '$root',
                                    as   : 'item',
                                    cond : {$and: [{$gte: ['$$item.date', startDate]}, {$lte: ['$$item.date', endDate]}]}
                                }
                            }
                        }
                    }, {
                        $project: {
                            startDebit : {$sum: '$startPeriod.debit'},
                            startCredit: {$sum: '$startPeriod.credit'},
                            endDebit   : {$sum: '$endPeriod.debit'},
                            endCredit  : {$sum: '$endPeriod.credit'}
                        }
                    }, {
                        $project: {
                            startBalance: {$subtract: ['$startDebit', '$startCredit']},
                            endBalance  : {$subtract: ['$endDebit', '$endCredit']}
                        }
                    }, /*{
                     $match: matchObject
                     }, {
                     $group: {
                     _id   : '$account',
                     debit : {$sum: '$debit'},
                     credit: {$sum: '$credit'}
                     }
                     }, */{
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : '_id',
                            foreignField: '_id',
                            as          : '_id'
                        }
                    }, {
                        $project: {
                            balance: {$multiply: [{$subtract: ['$endBalance', '$startBalance']}, -1]},
                            _id    : {$arrayElemAt: ['$_id', 0]}
                        }
                    }, {
                        $match: {
                            $or: [{
                                '_id.category': {$in: operatingReceivable.objectID()}
                            }]
                        }
                    }, {
                        $lookup: {
                            from        : 'accountsCategories',
                            localField  : '_id.category',
                            foreignField: '_id',
                            as          : '_id.category'
                        }
                    }, {
                        $project: {
                            balance       : 1,
                            '_id._id'     : 1,
                            '_id.name'    : 1,
                            '_id.category': {
                                $arrayElemAt: ['$_id.category', 0]
                            }
                        }
                    }, {
                        $sort: {
                            '_id.name': 1
                        }
                    }, {
                        $group: {
                            _id    : '$_id.category',
                            balance: {
                                $sum: '$balance'
                            },

                            root: {
                                $push: '$$ROOT'
                            }
                        }
                    }], function (err, result1) {
                        if (err) {
                            return cb(err);
                        }

                        Model.aggregate([{
                                $match: {
                                    date: {$lte: endDate}
                                }
                            }, {
                                $group: {
                                    _id : '$account',
                                    root: {$push: '$$ROOT'}
                                }
                            }, {
                                $project: {
                                    startPeriod: {
                                        $filter: {
                                            input: '$root',
                                            as   : 'item',
                                            cond : {$lt: ['$$item.date', startDate]}
                                        }
                                    },

                                    endPeriod: {
                                        $filter: {
                                            input: '$root',
                                            as   : 'item',
                                            cond : {$and: [{$gte: ['$$item.date', startDate]}, {$lte: ['$$item.date', endDate]}]}
                                        }
                                    }
                                }
                            }, {
                                $project: {
                                    startDebit : {$sum: '$startPeriod.debit'},
                                    startCredit: {$sum: '$startPeriod.credit'},
                                    endDebit   : {$sum: '$endPeriod.debit'},
                                    endCredit  : {$sum: '$endPeriod.credit'}
                                }
                            }, {
                                $project: {
                                    startBalance: {$subtract: ['$startDebit', '$startCredit']},
                                    endBalance  : {$subtract: ['$endDebit', '$endCredit']}
                                }
                            }
                                /*, {
                                 $match: matchObject
                                 }, {
                                 $group: {
                                 _id   : '$account',
                                 debit : {$sum: '$debit'},
                                 credit: {$sum: '$credit'}
                                 }
                                 }, {
                                 $lookup: {
                                 from        : 'chartOfAccount',
                                 localField  : '_id',
                                 foreignField: '_id',
                                 as          : '_id'
                                 }
                                 }, {
                                 $project: {
                                 balance: {$subtract: ['$debit', '$credit']},
                                 _id    : {$arrayElemAt: ['$_id', 0]}
                                 }*/, {
                                    $lookup: {
                                        from        : 'chartOfAccount',
                                        localField  : '_id',
                                        foreignField: '_id',
                                        as          : '_id'
                                    }
                                }, {
                                    $project: {
                                        balance: {$subtract: ['$startBalance', '$endBalance']},
                                        _id    : {$arrayElemAt: ['$_id', 0]}
                                    }
                                }, {
                                    $match: {
                                        $or: [{
                                            '_id.category': {$in: operatingPayable.objectID()}
                                        }]
                                    }
                                }, {
                                    $lookup: {
                                        from        : 'accountsCategories',
                                        localField  : '_id.category',
                                        foreignField: '_id',
                                        as          : '_id.category'
                                    }
                                }, {
                                    $project: {
                                        balance       : 1,
                                        '_id._id'     : 1,
                                        '_id.name'    : 1,
                                        '_id.category': {
                                            $arrayElemAt: ['$_id.category', 0]
                                        }
                                    }
                                }, {
                                    $sort: {
                                        '_id.name': 1
                                    }
                                }, {
                                    $group: {
                                        _id    : '$_id.category',
                                        balance: {
                                            $sum: '$balance'
                                        },

                                        root: {
                                            $push: '$$ROOT'
                                        }
                                    }
                                }
                            ],
                            function (err, result2) {
                                if (err) {
                                    return cb(err);
                                }

                                cb(null, result1.concat(result2));
                            }
                        )
                        ;
                    }
                );
            }
            ;

            getInvesting = function (cb) {
                Model.aggregate([{
                    $match: dateObject
                }, {
                    $match: {
                        account: {$in: CONSTANTS.INVESTING.objectID()}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id   : '$account._id',
                        name  : {$addToSet: '$account.name'},
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $group: {
                        _id   : null,
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'},
                        name  : {$addToSet: '$name'}
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            getFinancing = function (cb) {
                Model.aggregate([{
                    $match: dateObject
                }, {
                    $match: {
                        journal: DIVIDEND_INVOICE
                    }
                }, {
                    $group: {
                        _id   : '$account',
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : '_id',
                        foreignField: '_id',
                        as          : '_id'
                    }
                }, {
                    $project: {
                        balance: {$subtract: ['$debit', '$credit']},
                        _id    : {$arrayElemAt: ['$_id', 0]}
                    }
                }, {
                    $match: {
                        '_id.category': LIABILITIES
                    }
                }, {
                    $lookup: {
                        from        : 'accountsCategories',
                        localField  : '_id.category',
                        foreignField: '_id',
                        as          : '_id.category'
                    }
                }, {
                    $project: {
                        balance       : 1,
                        '_id._id'     : 1,
                        '_id.name'    : 1,
                        '_id.category': {$arrayElemAt: ['$_id.category', 0]}
                    }
                }, {
                    $sort: {
                        '_id.name': 1
                    }
                }, {
                    $group: {
                        _id    : '$_id.category',
                        balance: {$sum: '$balance'},
                        root   : {$push: '$$ROOT'}
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            async.parallel([getOperating, getInvesting, getFinancing], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({operating: result[0], investing: result[1], financing: result[2]});
            });
        }
        ;

        function getProfitAndLoss(req, res, next, cb) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var getIncome;
            var getExpenses;
            var getDividends;
            var getCOGS;
            var getTaxes;
            var INCOME = objectId('5810c75b2b225158086d7f83');
            var EXPENSE = objectId('5810c75b2b225158086d7f89');
            var query = req.query || {};
            var filter = query.filter;
            var dateObject = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            var TAX_ACCOUNT = objectId('565eb53a6aa50532e5df0bdd');

            var dateCondition = req.dateCondition || dateObject;

            getIncome = function (cb) {
                Model.aggregate([{
                    $match: dateCondition
                }, {
                    $match: {
                        credit: {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        credit : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $match: {
                        'account.category': INCOME
                    }
                }, {
                    $group: {
                        _id  : '$account._id',
                        name : {$first: '$account.name'},
                        debit: {$sum: '$credit'}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            getCOGS = function (cb) {
                Model.aggregate([{
                    $match: dateCondition
                }, {
                    $match: {
                        debit: {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $match: {
                        'account._id': objectId(CONSTANTS.COGS)
                    }
                }, {
                    $group: {
                        _id  : '$account._id',
                        name : {$first: '$account.name'},
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            getExpenses = function (cb) {
                Model.aggregate([{
                    $match: dateCondition
                }, {
                    $match: {
                        debit: {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $match: {
                        'account.budgeted': {$ne: true},
                        'account.category': EXPENSE,
                        'account._id'     : {$nin: [objectId(CONSTANTS.COGS), objectId("56cc6bf2541812c07197356a")]},

                    }
                }, {
                    $group: {
                        _id  : '$account._id',
                        name : {$first: '$account.name'},
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            getTaxes = function (cb) {
                Model.aggregate([{
                    $match: dateCondition
                }, {
                    $match: {
                        debit: {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $match: {
                        'account._id': TAX_ACCOUNT
                    }
                }, {
                    $group: {
                        _id  : '$account._id',
                        name : {$first: '$account.name'},
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            getDividends = function (cb) {
                Model.aggregate([{
                    $match: dateCondition
                }, {
                    $match: {
                        debit  : {$gt: 0},
                        journal: DIVIDEND_INVOICE
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date   : 1,
                        debit  : 1,
                        account: {$arrayElemAt: ['$account', 0]}
                    }
                }, {
                    $group: {
                        _id  : '$account._id',
                        name : {$first: '$account.name'},
                        debit: {$sum: '$debit'}
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, result);
                });
            };

            async.parallel([getIncome, getCOGS, getExpenses, getTaxes, getDividends], function (err, result) {
                if (err && !cb) {
                    return next(err);
                } else if (err) {
                    return cb(err);
                }

                if (!cb) {
                    return res.status(200).send({
                        income   : result[0],
                        cogs     : result[1],
                        expenses : result[2],
                        taxes    : result[3],
                        dividends: result[4]
                    });
                }

                cb(null, _.union(
                    result[0],
                    result[1],
                    result[2],
                    result[3],
                    result[4]
                ));

            });
        };

        this.getProfitAndLoss = function (req, res, next) {
            getProfitAndLoss(req, res, next);
        };

        this.getCashBook = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
            var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
            var Payment = models.get(req.session.lastDb, 'InvoicePayment', InvoicePaymentSchema);
            var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
            var query = req.query || {};
            var filter = query.filter || {};
            var dateObject = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            var startDate = filter.date.value[0];

            startDate = new Date(startDate);

            PaymentMethod.aggregate([{
                $group: {
                    _id: '$chartAccount'
                }
            }], function (err, result) {
                var accounts;

                if (err) {
                    return next(err);
                }

                accounts = _.pluck(result, '_id');

                Model.aggregate([{
                    $match: dateObject
                }, {
                    $match: {
                        account: {$in: accounts}
                    }
                }, {
                    $lookup: {
                        from        : 'chartOfAccount',
                        localField  : 'account',
                        foreignField: '_id',
                        as          : 'account'
                    }
                }, {
                    $project: {
                        date          : 1,
                        sourceDocument: 1,
                        account       : {$arrayElemAt: ['$account', 0]},
                        currency      : 1,
                        debit         : 1,
                        credit        : 1
                    }
                }, {
                    $project: {
                        date          : 1,
                        sourceDocument: 1,
                        'account.name': '$account.name',
                        'account._id' : '$account._id',
                        currency      : 1,
                        debit         : 1,
                        credit        : 1
                    }
                }, {
                    $sort: {
                        date: 1
                    }
                }, {
                    $group: {
                        _id     : null,
                        accounts: {$addToSet: '$account'},
                        root    : {$push: '$$ROOT'}
                    }
                }], function (err, resultAccounts) {

                    if (err) {
                        return next(err);
                    }

                    Model.aggregate([{
                        $match: {
                            account: {$in: accounts},
                            date   : {
                                $lt: new Date(startDate)
                            }
                        }
                    }, {
                        $project: {
                            debit  : {$divide: ['$debit', '$currency.rate']},
                            credit : {$divide: ['$credit', '$currency.rate']},
                            account: 1
                        }
                    }, {
                        $group: {
                            _id   : '$account',
                            debit : {$sum: '$debit'},
                            credit: {$sum: '$credit'}
                        }
                    }, {
                        $project: {
                            balance: {$subtract: ['$debit', '$credit']}
                        }
                    }], function (err, result) {
                        var resObj;
                        var newAccounts = [];
                        var keys = {};

                        if (err) {
                            return next(err);
                        }

                        resObj = resultAccounts && resultAccounts.length ? resultAccounts[0] : {};

                        resObj.accounts = resObj.accounts || [];
                        resObj.root = resObj.root || [];

                        resObj.accounts.forEach(function (el) {
                            if (!keys[el._id.toString()]) {
                                newAccounts.push(el);
                                keys[el._id.toString()] = true;
                            }
                        });

                        newAccounts.forEach(function (acc) {
                            var balance = _.find(resObj.root, function (el) {
                                return el && el._id ? el._id.toString() === acc._id.toString() : null;
                            });

                            balance = balance || {};

                            acc.balance = balance.balance || 0;
                        });

                        res.status(200).send({
                            data    : resObj.root,
                            accounts: newAccounts
                        });
                    });
                });
            });

        };

        this.getForGL = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query;
            var filter = query.filter || {};

            Model.aggregate([{
                $match: filterMapper.mapFilter(filter, {
                    contentType: journalEntryCT,
                    keysArray  : ['date']
                })
            }, {
                $group: {
                    _id   : '$account',
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'}
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : '_id',
                    foreignField: '_id',
                    as          : '_id'
                }
            }, {
                $project: {
                    debit : 1,
                    credit: 1,
                    _id   : {$arrayElemAt: ['$_id', 0]}
                }
            }, {
                $lookup: {
                    from        : 'accountsCategories',
                    localField  : '_id.category',
                    foreignField: '_id',
                    as          : '_id.category'
                }
            }, {
                $project: {
                    debit         : 1,
                    credit        : 1,
                    '_id._id'     : 1,
                    '_id.name'    : 1,
                    '_id.category': {$arrayElemAt: ['$_id.category', 0]}
                }
            }, {
                $sort: {
                    '_id.name': 1
                }
            }, {
                $group: {
                    _id   : '$_id.category',
                    debit : {$sum: '$debit'},
                    credit: {$sum: '$credit'},
                    root  : {$push: '$$ROOT'}
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

        };

        this.getPayrollForReport = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var query = req.query;
            var sourceDocument = query._id;
            var journalArray = [objectId(CONSTANTS.SALARY_PAYABLE), objectId(CONSTANTS.OVERTIME_PAYABLE)];
            var dataKey = query.dataKey;
            var year = parseInt(dataKey.slice(0, 4), 10);
            var month = parseInt(dataKey.slice(4), 10);
            var date = moment().year(year).month(month - 1).startOf('month');
            var endDate = moment(date).endOf('month');

            Model.aggregate([{
                $match: {
                    $and: [{$or: [{'sourceDocument.employee': objectId(sourceDocument)}, {'sourceDocument._id': objectId(sourceDocument)}]}, {
                        date: {
                            $gte: new Date(date),
                            $lte: new Date(endDate)
                        }
                    }, {
                        journal: {$ne: objectId('56cc734b541812c071973572')}
                    }]
                }
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $lookup: {
                    from        : 'currency',
                    localField  : 'currency._id',
                    foreignField: '_id',
                    as          : 'currency._id'
                }
            }, {
                $project: {
                    journal        : {$arrayElemAt: ['$journal', 0]},
                    account        : {$arrayElemAt: ['$account', 0]},
                    'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                    sourceDocument : 1,
                    'currency.name': 1,
                    debit          : 1,
                    credit         : 1,
                    debitFC        : 1,
                    creditFC       : 1,
                    date           : 1,
                    timestamp      : 1,
                    createdBy      : 1,
                    _type          : 1
                }
            }, {
                $project: {
                    'account._id' : 1,
                    'account.name': 1,
                    'journal.name': '$journal.name',
                    'journal._id' : '$journal._id',
                    sourceDocument: 1,
                    currency      : 1,
                    debit         : {$divide: ['$debit', 100]},
                    credit        : {$divide: ['$credit', 100]},
                    debitFC       : {$divide: ['$debitFC', 100]},
                    creditFC      : {$divide: ['$creditFC', 100]},
                    date          : 1,
                    timestamp     : 1,
                    createdBy     : 1,
                    _type         : 1
                }
            }, {
                $sort: {date: 1}
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
        };

        this.getForReport = function (req, res, next) {
            var Model = models.get(req.session.lastDb, journalEntryCT, journalEntrySchema);
            var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
            var query = req.query;
            var sourceDocument = query._id;
            var product;

            Product.findOne({job: sourceDocument}, {_id: 1}, function (err, result) {
                if (err) {
                    return next(err);
                }

                product = result ? result._id : null;

                Model
                    .aggregate([{
                        $match: {
                            'sourceDocument.model': 'product',
                            'sourceDocument._id'  : objectId(product),
                            debit                 : {$gt: 0}
                        }
                    }, {
                        $project: {
                            date : 1,
                            debit: 1
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
                            return next(err);
                        }

                        res.status(200).send({data: {wagesPayable: result}});
                    });
            });

        };

        function getForView(req, mainCallback) {
            var dbIndex = req.session.lastDb;
            var Model = models.get(dbIndex, 'journalEntry', journalEntrySchema);
            var data = req.query;
            var sort = data.sort;
            var paginationObject = pageHelper(data);
            var limit = paginationObject.limit;
            var skip = paginationObject.skip;
            var filter = data.filter || {};
            var filterObj;
            var key;
            var matchObject = {};
            var filterMapper = new FilterMapper();
            var aggregate;
            var matchFilter;
            var matchWithoutState;

            if (sort) {
                key = Object.keys(data.sort)[0].toString();
                data.sort[key] = parseInt(data.sort[key], 10);
                sort = data.sort;
            } else {
                sort = {date: -1, 'journal.name': 1, timestamp: 1, 'createdBy.date': -1};
            }

            /* filterObj = filterMapper.mapFilter(filter, 'journalEntry');

             if (filterObj.date) {
             matchObject.date = filterObj.date;

             delete filterObj.date;
             }*/

            if (filter.hasOwnProperty('sum')) {
                filter.debit = {
                    key  : 'debit',
                    value: filter.sum.value,
                    type : 'integer'
                };

                filter.credit = {
                    key  : 'credit',
                    value: filter.sum.value,
                    type : 'integer'
                };

                delete filter.sum;
            }

            matchFilter = filterMapper.mapFilter(filter, {
                contentType: journalEntryCT,
                keysArray  : ['date']
            });
            matchWithoutState = filterMapper.mapFilter(filter, {
                contentType : journalEntryCT,
                keysArray   : ['date'],
                withoutState: true
            });

            if (matchWithoutState.debit && matchWithoutState.credit) {
                matchWithoutState.$or = [{debit: matchWithoutState.debit}, {credit: matchWithoutState.credit}];

                delete matchWithoutState.debit;
                delete matchWithoutState.credit;

                if (matchWithoutState.timestamp) {
                    matchWithoutState.timestamp = matchWithoutState.timestamp;

                    delete matchWithoutState.$or;
                }

            }

            aggregate = Model.aggregate([{
                $match: matchFilter
            }, {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'account',
                    foreignField: '_id',
                    as          : 'account'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $lookup: {
                    from        : 'currency',
                    localField  : 'currency._id',
                    foreignField: '_id',
                    as          : 'currency._id'
                }
            }, {
                $project: {
                    journal        : {$arrayElemAt: ['$journal', 0]},
                    account        : {$arrayElemAt: ['$account', 0]},
                    'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                    sourceDocument : 1,
                    'currency.name': 1,
                    debit          : 1,
                    credit         : 1,
                    debitFC        : 1,
                    creditFC       : 1,
                    date           : 1,
                    timestamp      : 1,
                    createdBy      : 1,
                    _type          : 1
                }
            }, {
                $project: {
                    'account._id' : 1,
                    'account.name': 1,
                    'journal.name': '$journal.name',
                    'journal._id' : '$journal._id',
                    sourceDocument: 1,
                    currency      : 1,
                    debit         : 1,
                    credit        : 1,
                    debitFC       : 1,
                    creditFC      : 1,
                    date          : 1,
                    timestamp     : 1,
                    createdBy     : 1,
                    _type         : 1
                }
            }, {
                $match: matchWithoutState
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }]);

            aggregate.options = {allowDiskUse: true};

            aggregate.exec(function (err, result) {
                if (err) {
                    return mainCallback(err);
                }

                mainCallback(null, result);
            });
        }

        this.getForView = function (req, res, next) {
            var getData;
            var getTotal;

            getTotal = function (mainCallback) {
                totalCollectionLength(req, mainCallback);
            };

            getData = function (mainCallback) {
                getForView(req, mainCallback);
            };

            async.parallel([getTotal, getData], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    total      : result[0].total || 0,
                    totalDebit : result[0].totalDebit || 0,
                    totalCredit: result[0].totalCredit || 0,
                    data       : result[1],
                    totalValue : result[0].totalValue
                });
            });

        };

        this.removeByDocId = function (docId, dbIndex, callback) {
            var Model = models.get(dbIndex, journalEntryCT, journalEntrySchema);
            var id = docId;
            var query;

            if (id.length >= 24) {
                query = {'sourceDocument._id': id};
            } else {
                query = id;
            }

            Model
                .remove(query, function (err, result) {
                    callback(err, result);
                });
        };

        this.changeDate = function (query, date, dbIndex, callback) {
            var Model = models.get(dbIndex, journalEntryCT, journalEntrySchema);

            Model
                .update(query, {$set: {date: new Date(date)}}, {multi: true}, callback);
        };

        this.removeBulk = function (req, res, next) {
            var dbIndex = req.session.lastDb;
            var Model = models.get(dbIndex, journalEntryCT, journalEntrySchema);
            var body = req.body || {ids: []};
            var ids = body.ids;

            Model.remove({_id: {$in: ids}}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        };
    }
;

module.exports = Module;
