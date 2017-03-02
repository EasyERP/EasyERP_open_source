'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var RatesSchema = mongoose.Schemas.rates;
var moment = require('../public/js/libs/moment/moment');
var redisStore = require('../helpers/redisClient');

module.exports = function (models) {

    return new function () {
        var currencyRatesHelper = require('../helpers/currencyRates')(models);

        function create(options, callback) {
            var Model;
            var err;
            var dbName;
            var body = options.body;
            var sendResult = options.sendResult;

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

            Model = models.get(dbName, 'rates', RatesSchema);

            body._id = moment(new Date(body._id));
            body._id = body._id.format('YYYY-MM-DD');

            Model.findById(body._id, function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result._id) {
                    Model.update({_id: body._id}, {$set: {rates: _.extend(result.rates, body.rates)}}, function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        return getById({dbName: dbName, id: body._id}, callback);
                    });
                } else {
                    Model.update({_id: body._id}, {$set: body}, {upsert: true}, function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        return getById({dbName: dbName, id: body._id}, callback);
                    });
                }
            });

        }

        this.create = create;

        function getPrevious(options, callback) {
            var Model;
            var err;
            var dbName;
            var id = options.id;

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
            // delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'rates', RatesSchema);

            id = moment(new Date(id));
            id = id.format('YYYY-MM-DD');

            redisStore.readFromStorage('', id, function (err, data) {
                if (err) {
                    return callback(err);
                }

                if (data) {
                    return callback(null, JSON.parse(data));
                }

                Model.find({date: {$lt: new Date(id)}}).sort({date: -1}).lean().exec(function (err, result) {
                    var prev;

                    if (err) {
                        return callback(err);
                    }

                    prev = result && result.length ? result[0] : {};

                    redisStore.writeToStorage('', prev._id, JSON.stringify(prev));

                    callback(null, prev);

                });

            });
        }

        this.getPrevious = getPrevious;

        this.getPreviousAndCurrent = function (options, callback) {
            var err;
            var dbName;
            var parallel;

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
            // delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            parallel = [function (cb) {
                getPrevious(options, cb);
            }, function (cb) {
                getById(options, cb);
            }];

            async.parallel(parallel, function (err, result) {
                var resultObj = {};

                if (err) {
                    return callback(err);
                }

                resultObj.previous = result[0] && result[0].rates ? result[0].rates : {};
                resultObj.current = result[1] && result[1].rates ? result[1].rates : {};
                resultObj.base = result[1] && result[1].base ? result[1].base : 'USD';

                callback(null, resultObj);
            });
        };

        function getAndCreate(options, callback) {
            var err;
            var dbName;
            var date = options.id || options.date;

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

            date = moment(date);
            date = date.format('YYYY-MM-DD');

            currencyRatesHelper.get({dbName: dbName, date: date}, function (err, ratesObject) {
                var body = {};
                var rates;
                var currencies;
                var base;

                if (err && err.status >= 400) {
                    return getPrevious({dbName: dbName, id: date});
                } else if (err) {
                    return callback(err);
                }

                body = {};
                rates = ratesObject.rates || {};
                currencies = Object.keys(rates);
                base = ratesObject.base;

                body._id = ratesObject.date;
                body.date = ratesObject.date;
                body.base = base;
                body.rates = {};

                currencies.forEach(function (curr) {
                    if (!body.rates[curr]) {
                        body.rates[curr] = {};
                    }

                    if (curr !== base) {
                        body.rates[curr][base] = rates[curr];
                    }
                });

                create({dbName: dbName, body: body, sendResult: true}, callback);
            });

        }

        function getById(options, callback) {
            var Model;
            var err;
            var dbName;
            var id = options.id || options.date;
            var sendResult = options.sendResult;

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
            // delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'rates', RatesSchema);

            id = moment(new Date(id));
            id = id.format('YYYY-MM-DD');

            redisStore.readFromStorage('', id, function (err, data) {
                if (err) {
                    return callback(err);
                }

                if (data) {
                    return callback(null, JSON.parse(data));
                }

                Model.findById(id, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (!result) {

                        async.waterfall([function (cb) {
                            getPrevious(options, cb);
                        }, function (result, cb) {
                            if (result) {
                                return cb(null, result);
                            }
                            getAndCreate({dbName: dbName, date: id, sendResult: sendResult}, cb);
                        }], function (err, result) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, result);
                        });
                    } else {
                        callback(null, result);
                    }

                });
            });

        }

        this.getById = getById;
    };
};
