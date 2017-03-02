'use strict';

var mongoose = require('mongoose');
var async = require('async');
var shippingMethodSchema = mongoose.Schemas.shippingMethod;
var moment = require('../public/js/libs/moment/moment');

module.exports = function (models) {

    return new function () {
        this.create = function (options, callback) {
            var Model;
            var err;
            var dbName;
            var body = options.body;
            var model;

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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            model = new Model(body);

            model.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                getById({dbName: dbName, id: result._id}, callback);
            });
        };

        function getById(options, callback) {
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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.findById(id).populate('account', 'name').exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        }

        this.findOne = function (query, options, callback) {
            var Model;
            var err;
            var dbName;

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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.findOne(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.find = function (query, options, callback) {
            var Model;
            var err;
            var dbName;

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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.find(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.remove = function (options, callback) {
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
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.update = function (options, callback) {
            var Model;
            var err;
            var dbName;
            var id = options.id;
            var body = options.body;

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

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.findByIdAndUpdate(id, {$set: body}, {new: true}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                getById({dbName: dbName, id: id}, callback);
            });
        };

        this.getForDd = function (options, callback) {
            var Model;
            var err;
            var dbName;

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

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.find({}).populate('account', 'name').exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.populateShippingMethod = function (options, callback) {
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

            Model = models.get(dbName, 'shippingMethod', shippingMethodSchema);

            Model.populate(query, {
                path  : path,
                select: 'name'
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, query);
            });
        };
    };
};
