'use strict';

var mongoose = require('mongoose');
var PaymentSchema = mongoose.Schemas.Payment;
var purchasePaymentsSchema = mongoose.Schemas.purchasePayments;
var populateWrapper = require('../helpers/callbackWrapper').populate;
var validator = require('validator');
var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {

        this.create = function (options, callback) {
            var Payment;
            var dbName;
            var err;
            var payment;

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

            if (options.forSale) {
                Payment = models.get(dbName, 'Payment', PaymentSchema);
            } else {
                Payment = models.get(dbName, 'purchasePayments', purchasePaymentsSchema);
            }

            payment = new Payment(options);

            payment.save(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);

            });

        };

        this.findOne = function (query, options, callback) {
            var Payment;
            var dbName;
            var err;
            var _query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            Payment = models.get(dbName, 'Payment', PaymentSchema);
            _query = Payment.findOne(query, options);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, payment) {
                if (err) {
                    return callback(err);
                }

                callback(null, payment);
            });
        };

        this.find = function (query, options, callback) {
            var Payment;
            var dbName;
            var err;
            var _query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            Payment = models.get(dbName, 'Payment', PaymentSchema);
            _query = Payment.find(query, options);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, payment) {
                if (err) {
                    return callback(err);
                }

                callback(null, payment);
            });
        };

        this.findById = function (_id, options, callback) {
            var PaymentModel;
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

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            PaymentModel = models.get(dbName, 'Payment', PaymentSchema);
            query = PaymentModel.findById(_id);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, payment) {
                if (err) {
                    return callback(err);
                }

                callback(null, payment);
            });
        };

        this.findByIdAndUpdate = function (id, updateObj, options, callback) {
            var Payment;
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

            if (!dbName || !id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Payment = models.get(dbName, 'Payment', PaymentSchema);

            Payment.findByIdAndUpdate(id, {$set: updateObj}, options, function (err, payment) {
                if (err) {
                    return callback(err);
                }

                callback(null, payment);
            });
        };

        this.findAndUpdate = function (_query, updateObj, options, callback) {
            var Payment;
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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Payment = models.get(dbName, 'Payment', PaymentSchema);

            Payment.update(_query, updateObj, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };
    };
};

