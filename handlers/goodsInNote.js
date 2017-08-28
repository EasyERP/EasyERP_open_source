var GoodsInNotes = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');

    var GoodsInNotesHelper = require('../helpers/refunds');
    var GoodsInSchema = mongoose.Schemas.GoodsInNote;
    var AvailabilityHelper = require('../helpers/availability')(models);
    var AvailabilityService = require('../services/productAvailability')(models);
    var JournalEntryService = require('../services/journalEntry')(models);
    var OrderService = require('../services/order')(models);

    var goodsInNotesHelper = new GoodsInNotesHelper(models);

    var async = require('async');
    var _ = require('lodash');
    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);
    var path = require('path');

    function createHelper(body, options, cb) {
        var dbName = options.dbName;
        var GoodsInNote = models.get(dbName, 'GoodsInNote', GoodsInSchema);
        var user = options.uId;
        var goodsInNote;

        if (body.status && body.status.received) {
            if (!body.status) {
                body.status = {};
            }

            body.status.receivedOn = body.date ? new Date(body.date) : new Date();
            body.status.receivedById = user;
        }

        goodsInNote = new GoodsInNote(body);

        goodsInNote.createdBy.user = user;

        goodsInNote.save(function (err, goodsIn) {
            if (err) {
                return cb(err);
            }

            GoodsInNote.findById(goodsIn._id).populate('order', 'shippingMethod shippingExpenses').exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                AvailabilityHelper.receiveProducts({
                    dbName     : dbName,
                    uId        : user,
                    goodsInNote: result.toJSON()
                }, function (err) {

                    if (err) {
                        return cb(err);
                    }

                    if (result && result.order) {

                        OrderService.setInProgressStatus({
                            dbName: dbName,
                            query : {_id: result.order._id}
                        }, function (err) {
                            if (err) {
                                return cb(err);
                            }

                            // event.emit('recalculateStatus', req, result.order._id, next);

                        });
                    }

                    cb(null, goodsIn);
                });
            });
        });
    }

    this.createHelper = createHelper;

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var uId = req.session.uId;
        var options = {
            dbName: dbName,
            uId   : uId
        };

        createHelper(body, options, function (err, result) {
            if (err) {
                return next(err);
            }
            event.emit('recalculateStatus', req, result.order._id, next);
        });
    };

    this.createReturn = function (req, res, next) {
        var data = req.body;
        var user = req.session.uId;
        var dbName = req.session.lastDb;
        var options;

        if (!data.status) {
            data.status = {};
        }

        data.status.receivedOn = new Date();
        data.status.receivedById = user;

        options = {
            data  : data,
            dbName: dbName
        };

        goodsInNotesHelper.createProductReturn(options, function (err, order) {
            if (err) {
                return next(err);
            }

            if (order) {
                event.emit('recalculateStatus', req, order, next);
            }

            res.status(200).send({success: true});
        });
    };

    function bulkRemove(options, res, next) {
        var req = options.req;
        var GoodsInNote = models.get(req.session.lastDb, 'GoodsInNote', GoodsInSchema);
        var ids = options.ids || [];
        var isManufacturing = req.isManufacturing;
        var orderType = 'order';

        if (isManufacturing) {
            orderType = 'manufacturingOrder';
        }

        async.each(ids, function (id, cb) {
            GoodsInNote.findOne(id).populate(orderType).exec(function (err, goodsNote) {
                var options;

                if (err) {
                    return cb(err);
                }

                if (goodsNote && goodsNote[orderType]) {

                    async.each(goodsNote.orderRows, function (goodsOrderRow, callback) {

                        AvailabilityService.tryToRempve({
                            dbName: req.session.lastDb,
                            query : {
                                goodsInNote: goodsNote._id,
                                product    : goodsOrderRow.product,
                                warehouse  : goodsNote.warehouse
                            }
                        }, function (err) {
                            if (err) {
                                return callback(err);
                            }

                            options = {
                                dbName: req.session.lastDb,
                                query : {
                                    'sourceDocument.model': 'goodsInNote',
                                    'sourceDocument._id'  : id
                                }
                            };

                            JournalEntryService.remove(options);

                            callback();
                        });
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        event.emit('recalculateStatus', req, goodsNote[orderType]._id, next);

                        cb();
                    });

                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            GoodsInNote.remove({_id: {$in: ids}}, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (typeof  res.status === 'function') {
                    return res.status(200).send({success: 'Removed success'});
                }

                res();
            });
        });
    }

    this.removeByOrder = function (options, cb) {
        bulkRemove(options, cb, cb);
    };

};

module.exports = GoodsInNotes;
