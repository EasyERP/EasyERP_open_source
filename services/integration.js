'use strict';
var mongoose = require('mongoose');
var IntegrationsSchema = mongoose.Schemas.integrations;
var populateWrapper = require('../helpers/callbackWrapper').populate;
var _ = require('lodash');

module.exports = function (models) {
    return new function () {

        this.create = function (options, callback) {
            var dbName;
            var IntegrationsModel;
            var integration;
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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            IntegrationsModel = models.get(dbName, 'integrations', IntegrationsSchema);
            integration = new IntegrationsModel(options);
            integration.save(function (err, integration) {
                if (err) {
                    return callback(err);
                }

                callback(null, integration);
            });
        };

        this.findOne = function (query, options, callback) {
            var IntegrationsModel;
            var dbName;
            var _query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;


                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            IntegrationsModel = models.get(dbName, 'integrations', IntegrationsSchema);

            _query = IntegrationsModel.findOne(query, options);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, integration) {
                if (err) {
                    return callback(err);
                }

                callback(null, integration);
            });
        };

        this.find = function (query, options, callback) {
            var IntegrationsModel;
            var _dbQuery;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            IntegrationsModel = models.get(dbName, 'integrations', IntegrationsSchema);

            _dbQuery = IntegrationsModel.find(query, options);

            if (typeof callback !== 'function') {
                return _dbQuery;
            }

            _dbQuery.exec(function (err, integration) {
                if (err) {
                    return callback(err);
                }

                callback(null, integration);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var IntegrationsModel;
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

            if (!query || !updateObject || typeof updateObject !== 'object') {
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

            IntegrationsModel = models.get(dbName, 'integrations', IntegrationsSchema);
            IntegrationsModel.findOneAndUpdate(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findByIdAndRemove = function (options, callback) {
            var IntegrationsModel;
            var dbName;
            var err;
            var id;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            id = options.id;
            dbName = options.dbName;
            delete options.dbName;

            if (!dbName || !id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            IntegrationsModel = models.get(dbName, 'integrations', IntegrationsSchema);
            IntegrationsModel.findByIdAndRemove(id, function (err, deleted) {
                if (err) {
                    return callback(err);
                }

                callback(null, deleted);
            });
        };
    };
};
