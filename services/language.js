'use strict';

var mongoose = require('mongoose');
var LanguageSchema = mongoose.Schemas.language;
var validator = require('validator');
var _ = require('lodash');
var async = require('async');
var objectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    return new function () {
        this.get = function (options, callback) {
            var dbName;
            var Languages;
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

            Languages = models.get(dbName, 'language', LanguageSchema);

            Languages.find({}).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.create = function (options, callback) {
            var dbName;
            var LanguageModel;
            var languageModel;
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

            // options._id = objectId();

            LanguageModel = models.get(dbName, 'language', LanguageSchema);
            languageModel = new LanguageModel(options);
            languageModel.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var dbName;
            var Language;
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

            Language = models.get(dbName, 'language', LanguageSchema);
            Language.findByIdAndUpdate(_id, updateObject, _options, function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.findByIdAndRemove = function (options, callback) {
            var _id = options._id;
            var dbName;
            var Language;
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

            Language = models.get(dbName, 'language', LanguageSchema);
            Language.findByIdAndRemove(_id, function (err, res) {
                if (err) {
                    return callback(err);
                }

                callback(null, res);
            });
        };
    };
};
