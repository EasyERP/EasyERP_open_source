var mongoose = require('mongoose');
var CurrencySchema = mongoose.Schemas.Currency;

var validator = require('validator');
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var CurrencyModel;
            var currency;
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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CurrencyModel = models.get(dbName, 'currency', CurrencySchema);

            CurrencyModel.count({}, function (err, count) {
                options.sequence = count++;
                currency = new CurrencyModel(options);

                currency._id = options.name;

                CurrencyModel.count({_id: currency._id}, function (err, count) {
                    if (err) {
                        return callback(err);
                    }

                    if (!count) {
                        currency.save(function (err, currency) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, currency);
                        });
                    } else {
                        err = new Error('This Currency already exists.');
                        err.status = 400;

                        return callback(err);
                    }
                });
            });
        };

        this.findOne = function (query, options, callback) {
            var CurrencyModel;
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

            CurrencyModel = models.get(dbName, 'currency', CurrencySchema);
            CurrencyModel.findOne(query, options, function (err, currency) {
                if (err) {
                    return callback(err);
                }

                callback(null, currency);
            });
        };

        this.find = function (query, options, callback) {
            var CurrencyModel;
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

            CurrencyModel = models.get(dbName, 'currency', CurrencySchema);
            CurrencyModel.find(query, options).sort({active: -1}).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getNames = function (options, callback) {
            var CurrencyModel;
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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CurrencyModel = models.get(dbName, 'currency', CurrencySchema);

            CurrencyModel.aggregate([{
                $match: {
                    active: true
                }
            }, {
                $group: {
                    _id  : null,
                    names: {$addToSet: '$_id'}
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result && result.length ? result[0].names : []);
            });
        };

        this.update = function (options, callback) {
            var CurrencyModel;
            var dbName;
            var err;
            var id = options.id;
            var body = options.body || {};

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

            if (!dbName || !id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CurrencyModel = models.get(dbName, 'currency', CurrencySchema);

            CurrencyModel.findByIdAndUpdate(id, body, {new: true}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.remove = function (options, callback) {
            var CurrencyModel;
            var dbName;
            var err;
            var id = options.id;

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

            if (!dbName || !id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CurrencyModel = models.get(dbName, 'currency', CurrencySchema);

            CurrencyModel.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};
