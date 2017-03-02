'use strict';
var mongoose = require('mongoose');
var ProductsOptionsValuesSchema = mongoose.Schemas.ProductOptionsValues;
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.find = function (query, options, callback) {
            var ProductOptionsValue;
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

            ProductOptionsValue = models.get(dbName, 'ProductOptionsValues', ProductsOptionsValuesSchema);

            ProductOptionsValue.find(query, options, function (err, optionValues) {
                if (err) {
                    return callback(err);
                }

                callback(null, optionValues);
            });
        };

        this.findOne = function (query, options, callback) {
            var ProductOptionsValue;
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

            ProductOptionsValue = models.get(dbName, 'ProductOptionsValues', ProductsOptionsValuesSchema);

            ProductOptionsValue.findOne(query, options, function (err, optionValue) {
                if (err) {
                    return callback(err);
                }

                callback(null, optionValue);
            });
        };

        this.create = function (options, callback) {
            var ProductOptionsValue;
            var dbName;
            var err;
            var body = options.body;
            var productOptionsValue;

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

            ProductOptionsValue = models.get(dbName, 'ProductOptionsValues', ProductsOptionsValuesSchema);

            productOptionsValue = new ProductOptionsValue(body);

            productOptionsValue.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var ProductOptionsValue;
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

            ProductOptionsValue = models.get(dbName, 'ProductOptionsValues', ProductsOptionsValuesSchema);
            ProductOptionsValue.findOneAndUpdate(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };
    };
};
