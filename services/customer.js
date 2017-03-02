'use strict';

var mongoose = require('mongoose');
var CustomerSchema = mongoose.Schemas.Customer;

var validator = require('validator');
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var CustomerModel;
            var customer;
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

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            customer = new CustomerModel(options);
            customer.save(function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var CustomerModel;
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

            if (!_id || !updateObject || typeof updateObject !== 'object') {
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

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.findByIdAndUpdate(_id, updateObject, _options, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var CustomerModel;
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

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findById = function (_id, options, callback) {
            var CustomerModel;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;

            if (!dbName || !validator.isMongoId(_id)) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            query = CustomerModel.findById(_id);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var CustomerModel;
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

            dbName = options.dbName;

            delete options.dbName;

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.findByIdAndRemove(_id, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.findOne = function (query, options, callback) {
            var CustomerModel;
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

            dbName = options.dbName;

            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.findOne(query, options, function (err, customer) {
                if (err) {
                    return callback(err);
                }

                callback(null, customer);
            });
        };

        this.find = function (query, options, callback) {
            var CustomerModel;
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

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomerModel = models.get(dbName, 'Customers', CustomerSchema);
            CustomerModel.find(query, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};
