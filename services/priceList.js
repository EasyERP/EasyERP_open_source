'use strict';
var mongoose = require('mongoose');
var PriceListSchema = mongoose.Schemas.PriceLists;
var ObjectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var PriceList;
            var dbName;
            var err;
            var priceList;
            var cost;

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

            cost = options.cost;
            delete options.cost;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (!Object.keys(options).length) {
                if (cost) {
                    options = {
                        _id          : ObjectId("58109ae869b3249417f74bae"),
                        priceListCode: 'PL1',
                        name         : 'Default Costs',
                        currency     : 'USD',
                        cost         : true
                    };
                } else {
                    options = {
                        _id          : ObjectId("58109ae869b3249417f74baf"),
                        priceListCode: 'PL2',
                        name         : 'Sale Prices',
                        currency     : 'USD',
                        cost         : false
                    }
                }
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

