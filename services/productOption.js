'use strict';
var mongoose = require('mongoose');
var ProductsOptionsSchema = mongoose.Schemas.ProductOptions;
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.find = function (query, options, callback) {
            var ProductOption;
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

            ProductOption = models.get(dbName, 'ProductOptions', ProductsOptionsSchema);

            ProductOption.find(query, options, function (err, productOptions) {
                if (err) {
                    return callback(err);
                }

                callback(null, productOptions);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var ProductOption;
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

            ProductOption = models.get(dbName, 'ProductOptions', ProductsOptionsSchema);
            ProductOption.findOneAndUpdate(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findOne = function (query, options, callback) {
            var ProductOption;
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

            ProductOption = models.get(dbName, 'ProductOptions', ProductsOptionsSchema);

            ProductOption.findOne(query, options, function (err, productOption) {
                if (err) {
                    return callback(err);
                }

                callback(null, productOption);
            });
        };

        this.create = function (options, callback) {
            var ProductOption;
            var dbName;
            var err;
            var body = options.body;
            var productOption;

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

            ProductOption = models.get(dbName, 'ProductOptions', ProductsOptionsSchema);

            productOption = new ProductOption(body);

            productOption.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };
    };
};
