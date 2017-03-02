'use strict';

var populateWrapper = require('../helpers/callbackWrapper').populate;
var mongoose = require('mongoose');
var WorkflowSchema = mongoose.Schemas.workflow;
var validator = require('validator');
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var Workflow;
            var workflow;
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

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            workflow = new Workflow(options);
            workflow.save(function (err, workflow) {
                if (err) {
                    return callback(err);
                }

                callback(null, workflow);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var dbName;
            var Workflow;
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

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            Workflow.findByIdAndUpdate(_id, updateObject, _options, function (err, workflow) {
                if (err) {
                    return callback(err);
                }

                callback(null, workflow);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var dbName;
            var Workflow;
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

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            Workflow.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findById = function (_id, options, callback) {
            var dbName;
            var Workflow;
            var err;
            var query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;

            if (!dbName || !validator.isMongoId(_id)) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            query = Workflow.findById(_id);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, workflow) {
                if (err) {
                    return callback(err);
                }

                callback(null, workflow);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var dbName;
            var Workflow;
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

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            Workflow.findByIdAndRemove(_id, function (err, workflow) {
                if (err) {
                    return callback(err);
                }

                callback(null, workflow);
            });
        };

        this.find = function (query, options, callback) {
            var dbName;
            var Workflow;
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

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            Workflow.find(query, options, function (err, workflow) {
                if (err) {
                    return callback(err);
                }

                callback(null, workflow);
            });
        };

        this.findOne = function (query, options, callback) {
            var dbName;
            var Workflow;
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

            Workflow = models.get(dbName, 'workflows', WorkflowSchema);
            Workflow.findOne(query, options, function (err, workflow) {
                if (err) {
                    return callback(err);
                }

                callback(null, workflow);
            });
        };
    };
};
