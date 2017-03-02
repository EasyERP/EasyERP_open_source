'use strict';
var mongoose = require('mongoose');
var PaymentMethodSchema = mongoose.Schemas.PaymentMethod;

var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {

        this.getById = function (options, callback) {
            var PaymentMethod;
            var dbName;
            var id = options.id;
            var err;
            var paymentMethod;

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

            paymentMethod = models.get(dbName, 'PaymentMethod', PaymentMethodSchema);

            paymentMethod
                .findById(id)
                .exec(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                });
        };

        this.findOne = function (query, options, callback) {
            var PaymentMethod;
            var dbName;
            var err;
            var paymentMethod;

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

            paymentMethod = models.get(dbName, 'PaymentMethod', PaymentMethodSchema);

            paymentMethod
                .findOne(query)
                .exec(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                });
        };

        this.populatePaymentMethod = function (options, callback) {
            var Model;
            var err;
            var dbName;
            var query;
            var path;

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

            query = options.query;
            path = options.path;

            Model = models.get(dbName, 'PaymentMethod', PaymentMethodSchema);

            Model.populate(query, {
                path  : path,
                select: 'chartAccount'
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, query);
            });
        };
    };
};

