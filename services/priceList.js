'use strict';
var mongoose = require('mongoose');
var PriceListSchema = mongoose.Schemas.PriceLists;

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var PriceList;
            var dbName;
            var err;
            var priceList;

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

            PriceList = models.get(dbName, 'PriceList', PriceListSchema);
            priceList = new PriceList(options);

            priceList.save(function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };
    };
};

