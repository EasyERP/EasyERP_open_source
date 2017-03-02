'use strict';
var mongoose = require('mongoose');
var StockCorrectionsSchema = mongoose.Schemas.stockCorrection;

var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {

        this.create = function (options, callback) {
            var StockCorrection;
            var dbName;
            var body = options.body;
            var err;
            var stockCorrection;

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

            StockCorrection = models.get(dbName, 'stockCorrections', StockCorrectionsSchema);

            stockCorrection = new StockCorrection(body);

            stockCorrection.save(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });


        };

    };
};

