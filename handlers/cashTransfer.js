var mongoose = require('mongoose');
var oxr = require('open-exchange-rates');
var moment = require('../public/js/libs/moment/moment');
var fx = require('money');

var cashTransfer = function (models, event) {
    'use strict';

    var cashTransferSchema = mongoose.Schemas.cashTransfer;

    var async = require('async');
    var pageHelper = require('../helpers/pageHelper');
    var JournalEntryService = require('../services/journalEntry')(models);

    var ratesRetriever = require('../helpers/ratesRetriever')();
    var ratesService = require('../services/rates')(models);

    this.create = function (req, res, next) {
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var body = req.body;
        var currencyTo = body.currencyTo;
        var cashTransfer;
        var bodyJournalEntry = {};
        var rates;
        var base;
        var date = moment(new Date(body.date)).format('YYYY-MM-DD');
        var query = {dbName: req.session.lastDb, id: date};
        var currency;

        ratesService.getById(query, function (err, ratesObject) {
            var currencyRateTo;

            rates = ratesObject ? ratesObject.rates : {};
            base = ratesObject ? ratesObject.base : 'USD';

            currency = {currency: body.currency};
            currency.rate = ratesRetriever.getRate(rates, base, currency.name);

            currencyRateTo = ratesRetriever.getRate(rates, base, currencyTo);

            body.currency = currency;

            cashTransfer = new cashTransferModel(body);

            cashTransfer.save(function (err, result) {
                if (err) {
                    return next(err);
                }

                bodyJournalEntry = { // ToDo Cash Transefer between different accounts
                    currency: {
                        name: currencyTo,
                        rate: currencyRateTo
                    },

                    journal: null,
                    date   : new Date(result.date),

                    sourceDocument: {
                        model: 'cashTransfer',
                        name : result.name,
                        _id  : result._id
                    },

                    amount       : result.amount / currency.rate,
                    notDivideRate: true,
                    dbName       : req.session.lastDb,
                    uId          : req.session.uId,
                    accountsItems: [{
                        debit  : 0,
                        credit : result.amount / currency.rate,
                        account: body.creditAccount
                    }, {
                        debit  : result.amount / currency.rate,
                        credit : 0,
                        account: body.debitAccount
                    }]
                };

                JournalEntryService.createMultiRows(bodyJournalEntry, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: result});
                });
            });
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
        var sort = data.sort || {date: '-1'};
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

                JournalEntryService.remove({dbName: req.session.lastDb, query: {'sourceDocument._id': id}}, cb);

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
