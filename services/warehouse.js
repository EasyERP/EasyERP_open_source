'use strict';
var mongoose = require('mongoose');
var WarehouseSchema = mongoose.Schemas.warehouse;

var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {

        this.findOne = function (query, options, callback) {
            var dbName;
            var err;
            var Warehouse;

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

            Warehouse = models.get(dbName, 'warehouse', WarehouseSchema);

            Warehouse.findOne(query, options, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });

        };

    };
};

