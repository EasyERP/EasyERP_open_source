'use strict';

var mongoose = require('mongoose');
var async = require('async');
var orderRowsSchema = mongoose.Schemas.OrderRow;
var populateWrapper = require('../helpers/callbackWrapper').populate;

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var Model;
            var model;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'orderRows', orderRowsSchema);
            model = new Model(options);
            model.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.orderRowsFinder = function (options, callback) {
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

            Model = models.get(dbName, 'orderRows', orderRowsSchema);
            order = options.order;

            Model.aggregate([{
                $match: {
                    order: order
                }
            }, {
                $group: {
                    _id     : null,
                    products: {$push: '$product'}
                }
            }], function (err, result) {
                var products;

                if (err) {
                    return callback(err);
                }

                products = result && result.length ? result[0].products : [];

                callback(null, products);
            });

        };

        this.createMulti = function (options, callback) {
            var Model;
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

            Model = models.get(dbName, 'orderRows', orderRowsSchema);

            async.each(options.arrayRows, function (el, cb) {
                if (el._id) {
                    delete el._id;

                    Model.findByIdAndUpdate(el._id, {$set: el}, {new: true}, cb);
                } else {
                    Model.collection.insert(el, cb);
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                callback();

            });

            /*Model.collection.insertMany(options.arrayRows, function (err) {
             if (err) {
             return callback(err);
             }

             callback();
             });*/
        };

        this.remove = function (options, callback) {
            var Model;
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

            Model = models.get(dbName, 'orderRows', orderRowsSchema);

            Model.remove(options, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.findOne = function (options, callback) {
            var Model;
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

            Model = models.get(dbName, 'orderRows', orderRowsSchema);

            Model.findOne(options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.find = function (query, options, callback) {
            var Model;
            var dbName;
            var err;
            var _query;

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

            Model = models.get(dbName, 'orderRows', orderRowsSchema);
            _query = Model.find(query);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};


