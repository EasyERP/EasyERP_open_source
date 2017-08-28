'use strict';

var mongoose = require('mongoose');
var NationalitySchema = mongoose.Schemas.nationality;
var validator = require('validator');
var _ = require('lodash');
var async = require('async');
var objectId = mongoose.Types.ObjectId;
module.exports = function (models) {
    return new function () {
        this.get = function (options, callback) {
            var dbName;
            var Nationality;
            var error;

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
                error = new Error('Invalid input parameters');
                error.status = 400;

                return callback(error);
            }
            Nationality = models.get(dbName, 'nationality', NationalitySchema);

            Nationality.find({}, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.create = function (options, callback) {
            var dbName;
            var NationalityModel;
            var nationalityModel;
            var error;

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
                error = new Error('Invalid input parameters');
                error.status = 400;

                return callback(error);
            }

            options._id = objectId();

            NationalityModel = models.get(dbName, 'nationality', NationalitySchema);
            nationalityModel = new NationalityModel(options);
            nationalityModel.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var dbName;
            var Nationality;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!_id || !updateObject || typeof updateObject !== 'object') {
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

            Nationality = models.get(dbName, 'nationality', NationalitySchema);
            Nationality.findByIdAndUpdate(_id, updateObject, _options, function (err, nationality) {
                if (err) {
                    return callback(err);
                }

                callback(null, nationality);
            });

            /* var dbName;
             var Nationality;
             var nationality;
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

             Nationality = models.get(dbName, 'nationality', NationalitySchema);
             nationality = new Nationality(options);
             nationality.save(function (err, res) {
             if (err) {
             return callback(err);
             }

             callback(null, res);
             });*/
        };

        this.findByIdAndRemove = function (options, callback) {
            var _id = options._id;
            var dbName;
            var Nationality;
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

            Nationality = models.get(dbName, 'nationality', NationalitySchema);
            Nationality.findByIdAndRemove(_id, function (err, res) {
                if (err) {
                    return callback(err);
                }

                callback(null, res);
            });
        };
    };
};
