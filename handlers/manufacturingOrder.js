var mongoose = require('mongoose');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');

var ManufacturingOrder = function (models, event) {
    'use strict';

    var mapObject = require('../helpers/bodyMaper');

    var ManufacturingOrderService = require('../services/manufacturingOrder')(models);
    var goodsOutNotesService = require('../services/goodsOutNotes')(models);
    var goodsInNotesService = require('../services/goodsInNotes')(models);
    var orderRowsService = require('../services/orderRows')(models);
    var warehouseService = require('../services/warehouse')(models);
    var organizationSettingService = require('../services/organizationSetting')(models);
    var GoodsInNotesHelper = require('../helpers/refunds');
    var GoodsOutNote = require('../handlers/goodsOutNote');
    var GoodsInNote = require('../handlers/goodsInNote');
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var goodsOutNote = new GoodsOutNote(models, event);
    var goodsInNote = new GoodsInNote(models, event);
    var goodsInNotesHelper = new GoodsInNotesHelper(models);
    var pageHelper = require('../helpers/pageHelper');

    var CONSTANTS = require('../constants/mainConstants');

    var objectId = mongoose.Types.ObjectId;

    this.get = function (req, res, next) {
        var dbName = req.session.lastDb;
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var sort;
        var key;

        if (data.sort) {
            key = Object.keys(data.sort)[0];
            data.sort[key] = parseInt(data.sort[key], 10);
            sort = data.sort;
        } else {
            sort = {'createdBy.date': -1};
        }

        ManufacturingOrderService.get({dbName: dbName, skip: skip, limit: limit, sort: sort}, function (err, result) {
            var total;
            if (err) {
                return next(err);
            }

            total = result && result.length ? result[0].total : 0;

            res.status(200).send({data: result, total: total});
        });
    };

    this.getById = function (req, res, next) {
        var dbName = req.session.lastDb;
        var id = req.params.id;

        ManufacturingOrderService.getById2(req, res, next, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.create = function (req, res, next) {
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
        var dbName = req.session.lastDb;
        var body = mapObject(req.body);
        var mapedRows = [];
        var componentsRows;
        var historyOptions;
        var tasks;
        var createOrder;
        var gerWorkInProgress;
        var getWarehouseAccount;
        var createOrderRows;

        body.dbName = dbName;

        createOrder = function (cb) {
            ManufacturingOrderService.create(body, cb);
        };

        gerWorkInProgress = function (order, cb) {
            organizationSettingService.getWorkInProgress({dbName: dbName}, function (err, workInProgress) {
                if (err) {
                    return cb(err);
                }

                cb(null, order, workInProgress);
            });
        };

        getWarehouseAccount = function (order, workInProgress, cb) {
            warehouseService.findOne({_id: order.warehouse}, {dbName: dbName}, function (err, wh) {
                if (err) {
                    return cb(err);
                }

                cb(null, order, workInProgress, wh.account);
            });
        };

        createOrderRows = function (order, workInProgress, warehouseAccount, cb) {
            var componentsRows = body.components;

            if (componentsRows.length) {
                componentsRows.map(function (elem) {
                    mapedRows.push({
                        _id          : objectId(),
                        product      : objectId(elem.component._id),
                        order        : order._id,
                        quantity     : elem.quantity * order.quantity,
                        warehouse    : order.warehouse,
                        debitAccount : workInProgress,
                        creditAccount: warehouseAccount
                    });

                    OrderRows.collection.insertMany(mapedRows, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, order);
                    });
                });
            }
        };

        tasks = [createOrder, gerWorkInProgress, getWarehouseAccount, createOrderRows];

        async.waterfall(tasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).send(result);
        });
    };

    this.update = function (req, res, next) {
        var dbName = req.session.lastDb;
        var body = req.body;
        var id = req.params.id;
        var getGoodsOutNotes;
        var removeGoods;
        var removeGoodsIn;
        var getGoodsInNote;
        var waterfallTasks;

        ManufacturingOrderService.update(id, body, {
            dbName: dbName
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            if (body.cancel && body.forSales) {
                getGoodsOutNotes = function (callback) {
                    goodsOutNotesService.getByOrder({dbName: dbName, order: objectId(id)}, callback);
                };

                removeGoods = function (ids, callback) {
                    var options = {
                        ids            : ids,
                        dbName         : dbName,
                        req            : req,
                        isManufacturing: true
                    };
                    goodsOutNote.removeByOrder(options, callback);
                };

                getGoodsInNote = function (callback) {
                    goodsInNotesService.getByOrder({dbName: dbName, order: objectId(id)}, callback);
                };

                removeGoodsIn = function (ids, orderRows, callback) {

                    req.isManufacturing = true;
                    goodsInNote.removeByOrder({
                        ids            : ids,
                        dbName         : dbName,
                        req            : req,
                        isManufacturing: true
                    }, function (err) {
                        var rows = [];
                        if (err) {
                            return callback(err);
                        }

                        orderRows.forEach(function (row) {
                            rows.push(row.orderRowId);
                        });

                        orderRowsService.remove({dbName: dbName, _id: {$in: rows}}, callback);
                    });
                };

                waterfallTasks = [getGoodsOutNotes, removeGoods, getGoodsInNote, removeGoodsIn];
                async.waterfall(waterfallTasks, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            } else {
                res.status(200).send(result);
            }

        });

    };

    this.remove = function (req, res, next) {
        var dbName = req.session.lastDb;
        var _ids = req.params.id || req.body.ids;

        if (_ids.length) {
            async.each(_ids, function (id, cb) {
                ManufacturingOrderService.findByIdAndRemove({_id: id, dbName: dbName}, cb);
            }, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: 'Manufacturing order(s) was removed successfully', ids: _ids});
            });
        }
    };
};

module.exports = ManufacturingOrder;
