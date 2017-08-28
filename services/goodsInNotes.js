'use strict';
var mongoose = require('mongoose');
var GoodsInNotesSchema = mongoose.Schemas.GoodsInNote;

var ISODate = Date;

module.exports = function (models) {
    return new function () {
        this.goodsInFinder = function (options, callback) {
            var Model;
            var dbName;
            var err;
            var order;

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

            Model = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);
            order = options.order;

            Model.aggregate([{
                $match: {
                    order: order
                }
            }, {
                $unwind: '$orderRows'
            }, {
                $group: {
                    _id      : null,
                    orderRows: {$push: '$orderRows'}
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result && result.length ? result[0].orderRows : []);
            });

        };

        this.getByOrder = function (options, callback) {
            var GoodsInNote;
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

            GoodsInNote = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);

            GoodsInNote.aggregate([{
                $match: {
                    $or: [
                        {order: {$eq: order}},
                        {manufacturingOrder: {$eq: order}}
                    ],

                    _type: 'GoodsInNote'
                }
            }, {
                $group: {
                    _id      : null,
                    ids      : {$addToSet: '$_id'},
                    orderRows: {$addToSet: '$orderRows'}
                }
            }], function (err, result) {
                var ids;
                var orderRows;

                if (err) {
                    return callback(err);
                }

                ids = result && result.length ? result[0].ids : [];
                orderRows = result && result.length ? result[0].orderRows : [];

                callback(null, ids, orderRows);
            });
        };

        this.getBeforeStartDate = function (options, callback) {
            var GoodsInNote;
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

            GoodsInNote = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);

            GoodsInNote.aggregate([
                {
                    $match: {
                        _type : 'GoodsInNote',
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
                        name             : '$_id.product.name',
                        sku              : '$_id.sku',
                        warehouse        : '$_id.warehouse.name',
                        openingQuantityIn: '$quantity',
                        _id              : '$_id.product._id',
                        warehouseId      : '$_id.warehouse._id'
                    }
                }
            ]).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getBetwenDates = function (options, callback) {
            var GoodsInNote;
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

            GoodsInNote = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);

            GoodsInNote.aggregate([
                {
                    $match: {
                        _type : 'GoodsInNote',
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
                        warehouse: {$arrayElemAt: ['$warehouse', 0]},
                        product  : {$arrayElemAt: ['$product', 0]},
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
                        name           : '$_id.product.name',
                        warehouse      : '$_id.warehouse.name',
                        sku            : '$_id.sku',
                        inwardsQuantity: '$quantity',
                        _id            : '$_id.product._id',
                        warehouseId    : '$_id.warehouse._id'
                    }
                }
            ]).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        }
    };
};
