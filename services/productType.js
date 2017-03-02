'use strict';
var mongoose = require('mongoose');
var ProductTypeSchema = mongoose.Schemas.productTypes;
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.find = function (query, options, callback) {
            var Product;
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

            Product = models.get(dbName, 'productTypes', ProductTypeSchema);

            Product.find(query, options, function (err, products) {
                if (err) {
                    return callback(err);
                }

                callback(null, products);
            });
        };

        this.findOne = function (query, options, callback) {
            var ProductType;
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

            ProductType = models.get(dbName, 'productTypes', ProductTypeSchema);

            ProductType.findOne(query, options, function (err, product) {
                if (err) {
                    return callback(err);
                }

                callback(null, product);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var ProductType;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            ProductType = models.get(dbName, 'productTypes', ProductTypeSchema);
            ProductType.findOneAndUpdate(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.create = function (options, callback) {
            var ProductType;
            var dbName;
            var err;
            var body = options.body;
            var productType;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            ProductType = models.get(dbName, 'productTypes', ProductTypeSchema);

            productType = new ProductType(body);

            productType.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };
    };
};
