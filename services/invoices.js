'use strict';

var mongoose = require('mongoose');
var InvoiceSchema = mongoose.Schemas.Invoices;

var validator = require('validator');
var _ = require('lodash');

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

            Model = models.get(dbName, 'Invoices', InvoiceSchema);
            model = new Model(options);
            model.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.findOne = function (query, options, callback) {
            var Invoice;
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

            if (!query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Invoice = models.get(dbName, 'Invoices', InvoiceSchema);
            Invoice.findOne(query, function (err, invoice) {
                if (err) {
                    return callback(err);
                }

                callback(null, invoice);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var Invoice;
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

            Invoice = models.get(dbName, 'Invoices', InvoiceSchema);
            Invoice.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.find = function (query, options, callback) {
            var Model;
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

            Model = models.get(dbName, 'Invoices', InvoiceSchema);
            Model.find(query, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getSourceForRefund = function (options, callback) {
            var _options = {};
            var Invoice;
            var dbName;
            var err;
            var sourceDocument = options.sourceDocument;

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

            Invoice = models.get(dbName, 'Invoice', InvoiceSchema);

            Invoice.findOne({sourceDocument: sourceDocument}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result._id) {
                    callback(null, {id: result._id, invoice: true});
                } else {
                    callback(null, {id: sourceDocument, order: true});
                }
            });
        };

        this.findByIdAndUpdate = function (id, updateObj, options, callback) {
            var _options = {};
            var Invoice;
            var dbName;
            var err;

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!id || !updateObj || typeof updateObj !== 'object') {
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

            Invoice = models.get(dbName, 'Invoices', InvoiceSchema);
            Invoice.findByIdAndUpdate(id, updateObj, _options, function (err, resultInvoice) {
                if (err) {
                    return callback(err);
                }

                callback(null, resultInvoice);
            });
        }
    };
};
