'use strict';

var mongoose = require('mongoose');
var taxesSchema = mongoose.Schemas.taxes;

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var Taxes;
            var taxes;
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

            Taxes = models.get(dbName, 'taxes', taxesSchema);

            taxes = new Taxes(options);
            taxes.save(function (err, tax) {
                if (err) {
                    return callback(err);
                }

                callback(null, tax);
            });
        };

        this.findOne = function (query, options, callback) {
            var Taxes;
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

            Taxes = models.get(dbName, 'taxes', taxesSchema);
            Taxes.findOne(query, options, function (err, order) {
                if (err) {
                    return callback(err);
                }

                callback(null, order);
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

            Model = models.get(dbName, 'taxes', taxesSchema);

            Model.collection.insertMany(options.taxes, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        }
    };
};
