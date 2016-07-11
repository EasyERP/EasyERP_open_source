var mongoose = require('mongoose');

var cashTransfer = function (models, event) {
    'use strict';

    var cashTransferSchema = mongoose.Schemas.cashTransfer;

    var async = require('async');
    var pageHelper = require('../helpers/pageHelper');
    var CONSTANTS = require('../constants/mainConstants');

    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models, event);

    this.create = function (req, res, next) {
        var cashTransferModel = models.get(req.session.lastDb, 'cashTransfer', cashTransferSchema);
        var body = req.body;
        var cashTransfer = new cashTransferModel(body);
        var bodyJournalEntry = {};

        cashTransfer.save(function (err, result) {
            if (err) {
                return next(err);
            }

            bodyJournalEntry = {
                currency: CONSTANTS.CURRENCY_USD,
                journal : CONSTANTS.SALARY_PAYMENT_JOURNAL,
                date    : new Date(result.date),

                sourceDocument: {
                    model: 'cashTransfer',
                    _id  : result._id
                },

                amount: result.amount
            };

            _journalEntryHandler.createReconciled(bodyJournalEntry, req.session.lastDb, function () {

            }, req.session.uId);

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
            cashTransferModel.find().populate('debitAccount', 'name').populate('creditAccount', 'name').skip(skip).limit(limit).sort(sort).exec(function (err, _res) {
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

        cashTransferModel.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
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
