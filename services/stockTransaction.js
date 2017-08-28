'use strict';
var mongoose = require('mongoose');
var StockTransactionSchema = mongoose.Schemas.stockTransactions;

var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {

        this.create = function (options, callback) {
            var StockTransaction;
            var dbName;
            var body = options.body;
            var err;
            var stockTransaction;

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

            StockTransaction = models.get(dbName, 'stockTransactions', StockTransactionSchema);

            stockTransaction = new StockTransaction(body);

            stockTransaction.save(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);

            });

        };

        this.get = function (options, callback) {
            var StockTransaction;
            var dbName;
            var match = options.match;
            var matchObject = options.matchObject || {};
            var sort = options.sort;
            var skip = options.skip;
            var limit = options.limit;
            var err;
            var stockTransaction;

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

            StockTransaction = models.get(dbName, 'stockTransactions', StockTransactionSchema);

            StockTransaction
                .aggregate([{
                    $match: match
                }, {
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'warehouse',
                        foreignField: '_id',
                        as          : 'warehouse'
                    }
                }, {
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'warehouseTo',
                        foreignField: '_id',
                        as          : 'warehouseTo'
                    }
                }, {
                    $lookup: {
                        from        : 'locations',
                        localField  : 'location',
                        foreignField: '_id',
                        as          : 'location'
                    }
                }, {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'createdBy.user',
                        foreignField: '_id',
                        as          : 'createdBy.user'
                    }
                }, {
                    $project: {
                        _id             : 1,
                        location        : {$arrayElemAt: ['$location', 0]},
                        warehouse       : {$arrayElemAt: ['$warehouse', 0]},
                        warehouseTo     : {$arrayElemAt: ['$warehouseTo', 0]},
                        'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                        'createdBy.date': 1,
                        description     : 1,
                        name            : 1,
                        status          : 1,
                        notRemovable    : {$ifNull: ['$status.shippedById', false]}
                    }
                }, {
                    $match: matchObject
                }, {
                    $group: {
                        _id  : null,
                        total: {$sum: 1},
                        root : {$push: '$$ROOT'}
                    }
                }, {
                    $unwind: '$root'
                }, {
                    $project: {
                        _id         : '$root._id',
                        name        : '$root.name',
                        location    : '$root.location',
                        warehouse   : '$root.warehouse',
                        warehouseTo : '$root.warehouseTo',
                        createdBy   : '$root.createdBy',
                        status      : '$root.status',
                        description : '$root.description',
                        notRemovable: '$root.notRemovable',
                        total       : 1
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }
                ], function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    callback(null, result);
                });

        };

        this.getById = function (options, callback) {
            var StockTransaction;
            var dbName;
            var id = options.id;
            var err;
            var stockTransaction;

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

            StockTransaction = models.get(dbName, 'stockTransaction', StockTransactionSchema);

            StockTransaction
                .findById(id)
                .populate('warehouse', ' name address')
                .populate('warehouseTo', ' name address')
                .populate('location', ' name')
                .populate('orderRows.product', 'name info')
                .populate('orderRows.locationsDeliver', 'name')
                .populate('orderRows.locationsReceived.location', 'name')
                .populate('createdBy.user', 'login')
                .exec(function (err, correction) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, correction);
                });

        };

        this.updateById = function (options, callback) {
            var StockTransaction;
            var dbName;
            var id = options.id;
            var body = options.body;
            var settings = options.settings;
            var err;
            var stockTransaction;

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

            StockTransaction = models.get(dbName, 'stockTransaction', StockTransactionSchema);

            StockTransaction
                .findByIdAndUpdate(id, body, settings, function (err, correction) {
                    if (err) {
                        return callback(err);
                    }

                    correction.populate('warehouseTo')
                        .populate('warehouse', callback);

                });

        };

        this.remove = function (options, callback) {
            var StockTransaction;
            var dbName;
            var ids = options.ids;
            var err;
            var stockTransaction;

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

            StockTransaction = models.get(dbName, 'stockTransaction', StockTransactionSchema);

            StockTransaction.remove({_id: {$in: ids}}, function (err, removed) {
                if (err) {
                    return callback(err);
                }

                callback(null, removed);
            });

        };
    };
};

