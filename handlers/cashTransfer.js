var mongoose = require('mongoose');
var oxr = require('open-exchange-rates');
var moment = require('../public/js/libs/moment/moment');
var fx = require('money');

var cashTransfer = function (models, event) {
    'use strict';

    var cashTransferSchema = mongoose.Schemas.cashTransfer;
    var journalSchema = mongoose.Schemas.journal;
    var CurrencySchema = mongoose.Schemas.Currency;

    var async = require('async');
    var pageHelper = require('../helpers/pageHelper');
    var CONSTANTS = require('../constants/mainConstants');

    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models, event);

    oxr.set({app_id: process.env.OXR_APP_ID});

    this.create = function (req, res, next) {
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var Currency = models.get(req.session.lastDb, 'currency', CurrencySchema);
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var body = req.body;
        var currencyTo = body.currencyTo;
        var cashTransfer;
        var bodyJournalEntry = {};
        var waterfallTasks;
        var getCurrency;
        var getJournal;
        var createDocument;
        var date = moment(new Date(body.date)).format('YYYY-MM-DD');

        getCurrency = function (cb) {
            Currency.find({name: body.currency}, {name: 1}, function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result && result.length ? result[0].toJSON() : {_id: CONSTANTS.CURRENCY_USD, name: 'USD'});
            });
        };

        getJournal = function (currency, cb) {
            Journal.update({
                debitAccount : body.debitAccount,
                creditAccount: body.creditAccount
            }, {
                $set: {
                    debitAccount : body.debitAccount,
                    creditAccount: body.creditAccount,
                    name         : 'Cash Transfer',
                    transaction  : 'Payment'
                }
            }, {upsert: true}, function (err, result) {
                var modelId;
                var query = {};

                if (err) {
                    return cb(err);
                }

                modelId = result && result.upserted && result.upserted.length ? result.upserted[0]._id : null;

                if (modelId) {
                    query._id = modelId;
                } else {
                    query.debitAccount = body.debitAccount;
                    query.creditAccount = body.creditAccount;
                }

                Journal.find(query, function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, currency, result && result.length ? result[0]._id : null);
                });
            });

        };

        createDocument = function (currency, journal, cb) {

            oxr.historical(date, function () {
                var currencyRateTo;
                /* fx.rates = oxr.rates;
                 fx.base = oxr.base;*/

                if (currency && currency.name) {
                    currency.rate = oxr.rates[currency.name];
                }

                currencyRateTo = oxr.rates[currencyTo];

                body.currency = currency;

                cashTransfer = new cashTransferModel(body);

                cashTransfer.save(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    bodyJournalEntry = {
                        currency: {
                            name: currencyTo,
                            rate: currencyRateTo
                        },

                        journal: journal,
                        date   : new Date(result.date),

                        sourceDocument: {
                            model: 'cashTransfer',
                            _id  : result._id
                        },

                        amount: result.amount * currency.rate
                    };

                    _journalEntryHandler.createReconciled(bodyJournalEntry, req.session.lastDb, function () {

                    }, req.session.uId);

                    cb();
                });
            });
        };

        waterfallTasks = [getCurrency, getJournal, createDocument];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: result});
        });

    };

    this.patchM = function (req, res, next) {
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var body = req.body;

        async.each(body, function (data, cb) {
            var id = data._id;

            delete data._id;
            cashTransferModel.findByIdAndUpdate(id, {$set: data}, {new: true}, cb);
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.getList = function (req, res, next) {
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var data = req.query;
        var sort = data.sort || {};
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var parallelTasks;

        var getTotal = function (pCb) {

            cashTransferModel.count(function (err, _res) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, _res);
            });
        };

        var getData = function (pCb) {
            cashTransferModel
                .find()
                .populate('debitAccount', 'name')
                .populate('creditAccount', 'name')
                .skip(skip)
                .limit(limit)
                .sort(sort)
                .exec(function (err, _res) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, _res);
                });
        };

        parallelTasks = [getTotal, getData];

        async.parallel(parallelTasks, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] || 0;

            response.total = count;
            response.data = result[1];

            res.status(200).send(response);
        });

    };

    this.remove = function (req, res, next) {
        var id = req.params._id;
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);

        cashTransferModel.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: result});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            cashTransferModel.remove({_id: id}, function (err, removed) {
                if (err) {
                    return cb(err);
                }

                _journalEntryHandler.removeByDocId(id, req.session.lastDb, cb);

            });
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getForDD = function (req, res, next) {
        var Bonus = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);

        Bonus
            .find()
            .select('_id name')
            .sort({name: 1})
            .lean()
            .exec(function (err, cashTransfers) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: cashTransfers});
            });
    };
};

module.exports = cashTransfer;
