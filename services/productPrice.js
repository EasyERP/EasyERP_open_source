'use strict';
var mongoose = require('mongoose');
var ProductPricesSchema = mongoose.Schemas.ProductPrices;
var populateWrapper = require('../helpers/callbackWrapper').populate;
var objectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    return new function () {
        this.remove = function (options, callback) {
            var ProductPrice;
            var dbName;
            var err;
            var query = options.query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            ProductPrice = models.get(dbName, 'ProductPrice', ProductPricesSchema);

            ProductPrice.remove(query, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.create = function (options, callback) {
            var ProductPrice;
            var productPrice;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            ProductPrice = models.get(dbName, 'ProductPrice', ProductPricesSchema);

            productPrice = new ProductPrice(options);

            productPrice.save(function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.findOne = function (query, options, callback) {
            var ProductPrice;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
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

            ProductPrice = models.get(dbName, 'ProductPrice', ProductPricesSchema);

            ProductPrice.findOne(query, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

        this.find = function (query, options, callback) {
            var ProductPrice;
            var dbName;
            var _query;
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

            ProductPrice = models.get(dbName, 'ProductPrice', ProductPricesSchema);

            _query = ProductPrice.find(query);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };
    };
};

