'use strict';
var mongoose = require('mongoose');
var GoodsOutNotesSchema = mongoose.Schemas.goodsOutNotes;
var GoodsInNotesSchema = mongoose.Schemas.goodsInNote;
var populateWrapper = require('../helpers/callbackWrapper').populate;
var _ = require('underscore');
var async = require('async');
var ISODate = Date;

module.exports = function (models) {
    var journalEntriesService = require('./journalEntry')(models);

    return new function () {

        this.create = function (options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;
            var goodsOutNote;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            goodsOutNote = new GoodsOutNote(options);

            goodsOutNote.save(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);

            });
        };

        this.findOne = function (query, options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            GoodsOutNote.findOne(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });

        };

        this.find = function (query, options, callback) {
            var GoodsOutNote;
            var dbName;
            var queryFunc;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);
            queryFunc = GoodsOutNote.find(query);

            if (typeof callback !== 'function') {
                return queryFunc;
            }

            queryFunc.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });

        };

        this.remove = function (options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;
            var id = options.id;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            GoodsOutNote.findByIdAndRemove(id, function (err, result) {
                var query;
                if (err) {
                    return callback(err);
                }

                query = {
                    'sourceDocument._id': id
                };

                journalEntriesService.remove({dbName: dbName, query: query}, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                })

            });
        };

        this.getByOrder = function (options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;
            var order = options.order;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            GoodsOutNote.aggregate([{
                $match: {
                    $or: [{
                        order: {$eq: order}
                    }, {
                        manufacturingOrder: {$eq: order}
                    }],

                    _type: 'GoodsOutNote'
                }
            }, {
                $group: {
                    _id: null,
                    ids: {$addToSet: '$_id'}
                }
            }], function (err, result) {
                var ids;

                if (err) {
                    return callback(err);
                }

                ids = result && result.length ? result[0].ids : [];

                callback(null, ids);
            });
        };

        this.update = function (updateObj, options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;
            var id;
            var query = options.query;
            var product;
            var updateQty = options.updateQty;
            var purchase = options.purchase;

            if (query) {
                id = query._id;
                product = query['orderRows.product'];
            } else {
                id = options.id;
                query = {_id: id};
            }

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            // id = options.id;

            delete options.dbName;
            delete options.updateQty;
            // delete options.id;

            if (!dbName || !id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            if (purchase) {
                GoodsOutNote = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);
            }

            GoodsOutNote.findById(query._id, function (err, doc) {
                var prod;
                var cost;
                var qty;
                var newCost;

                if (err) {
                    return callback(err);
                }

                prod = _.find(doc.orderRows, function (el) {
                    return el.product.toString() === product.toString();
                });

                cost = prod ? prod.cost : 0;

                qty = prod ? prod.quantity : 1;

                if (!purchase) {
                    cost = cost / qty;
                }

                newCost = cost * (qty - updateQty);

                if (!updateObj.$pull && !purchase) {
                    updateObj['orderRows.$.cost'] = newCost;
                }

                console.log(updateObj);

                GoodsOutNote.update(query, updateObj, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    GoodsOutNote.findById(query._id, function (err, doc) {

                        if (err) {
                            return callback(err);
                        }

                        if (doc.orderRows && !doc.orderRows.length) {
                            GoodsOutNote.findByIdAndUpdate(query._id, {$set: {archived: true}}, function (err) {
                                if (err) {
                                    return callback(err);
                                }

                                callback(null, {cost: cost, orderRowId: prod ? prod.orderRowId : null});
                            });
                        } else {
                            callback(null, {cost: cost, orderRowId: prod ? prod.orderRowId : null});
                        }
                    });

                });
            });
        };

        this.findByIdAndUpdate = function (updateObj, options, callback, populate) {
            var GoodsOutNote;
            var dbName;
            var err;
            var id;
            var query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            id = options.id;

            delete options.dbName;
            delete options.id;

            if (!dbName || !id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            query = GoodsOutNote.findByIdAndUpdate(id, updateObj, options);

            if (populate) {
                query.populate(populate);
            }

            query.exec(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

        this.getBetwenDates = function (options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;
            var startDate;
            var endDate;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            startDate = options.startDate || new Date();
            endDate = options.endDate || new Date();

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            GoodsOutNote.aggregate([
                {
                    $match: {
                        _type : 'GoodsOutNote',
                        'date': {
                            $ne : null,
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'warehouse',
                        foreignField: '_id',
                        as          : 'warehouse'
                    }
                },
                {
                    $unwind: {
                        path                      : '$orderRows',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from        : 'Products',
                        localField  : 'orderRows.product',
                        foreignField: '_id',
                        as          : 'product'
                    }
                },
                {
                    $project: {
                        product  : {$arrayElemAt: ['$product', 0]},
                        warehouse: {$arrayElemAt: ['$warehouse', 0]},
                        orderRows: 1
                    }
                },
                {
                    $group: {
                        _id     : {
                            product  : '$product',
                            warehouse: '$warehouse',
                            sku      : '$product.info.SKU'
                        },
                        //cost    : {$sum: '$orderRows.cost'},
                        quantity: {$sum: '$orderRows.quantity'}
                    }
                },
                {
                    $project: {
                        name            : '$_id.product.name',
                        sku             : '$_id.sku',
                        warehouse       : '$_id.warehouse.name',
                        outwardsQuantity: '$quantity',
                        _id             : '$_id.product._id'
                    }
                }
            ]).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });

        };

        this.getBeforeStartDate = function (options, callback) {
            var GoodsOutNote;
            var dbName;
            var err;
            var startDate;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            startDate = options.startDate || new Date();

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutNotesSchema);

            GoodsOutNote.aggregate([
                {
                    $match: {
                        _type : 'GoodsOutNote',
                        'date': {
                            $ne : null,
                            $lte: new Date(startDate)
                        }
                    }
                },
                {
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'warehouse',
                        foreignField: '_id',
                        as          : 'warehouse'
                    }
                },
                {
                    $unwind: {
                        path                      : '$orderRows',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from        : 'Products',
                        localField  : 'orderRows.product',
                        foreignField: '_id',
                        as          : 'product'
                    }
                },
                {
                    $project: {
                        product  : {$arrayElemAt: ['$product', 0]},
                        warehouse: {$arrayElemAt: ['$warehouse', 0]},
                        orderRows: 1
                    }
                },
                {
                    $group: {
                        _id     : {
                            product  : '$product',
                            warehouse: '$warehouse',
                            sku      : '$product.info.SKU'
                        },
                        //cost    : {$sum: '$orderRows.cost'},
                        quantity: {$sum: '$orderRows.quantity'}
                    }
                },
                {
                    $project: {
                        name              : '$_id.product.name',
                        sku               : '$_id.sku',
                        warehouse         : '$_id.warehouse.name',
                        openingQuantityOut: '$quantity',
                        _id               : '$_id.product._id',
                        warehouseId       : '$_id.warehouse._id'
                    }
                }
            ]).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};

