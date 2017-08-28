'use strict';

var mongoose = require('mongoose');
var customReportSchema = mongoose.Schemas.CustomReports;
var _ = require('lodash');
var populateWrapper = require('../helpers/callbackWrapper').populate;

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var CustomReportModel;
            var customReport;
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

            CustomReportModel = models.get(dbName, 'CustomReport', customReportSchema);

            customReport = new CustomReportModel(options);
            customReport.save(function (err, customReport) {
                if (err) {
                    return callback(err);
                }

                callback(null, customReport);
            });
        };

        this.findOne = function (query, options, callback) {
            var dbName;
            var CustomReport;
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

            CustomReport = models.get(dbName, 'CustomReport', customReportSchema);

            CustomReport.findOne(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.get = function (options, callback) {
            var query = {};
            var CustomReport;
            var dbName;
            var error;
            var _query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (options.query) {
                query = options.query;
            }

            if (!dbName) {
                error = new Error('Invalid parameters');
                error.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(error);
                }

                return callback(error);
            }

            CustomReport = models.get(dbName, 'CustomReport', customReportSchema);

            _query = CustomReport.find(query);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getByType = function (options, callback) {
            var aggregateArray = [{
                $group: {
                    _id  : '$reportType',
                    items: {
                        $push: '$$ROOT'
                    }
                }
            }];
            var CustomReport;
            var dbName;

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

            if (options.query) {
                aggregateArray.unshift(options.query);
            }

            CustomReport = models.get(dbName, 'CustomReport', customReportSchema);

            CustomReport.aggregate([{
                $group: {
                    _id  : '$reportType',
                    items: {
                        $push: '$$ROOT'
                    }
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.remove = function (options, callback) {
            var dbName;
            var CustomReportModel;
            var customReport;
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

            CustomReportModel = models.get(dbName, 'CustomReport', customReportSchema);

            CustomReportModel.remove(options, function (err) {
                if (err) {
                    return callback();
                }

                callback();
            });
        };

        this.findByIdAndUpdate = function (updateObj, options, callback) {
            var CustomReport;
            var dbName;
            var err;
            var _id;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            _id = options.id;

            delete options.dbName;
            delete options.id;

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            CustomReport = models.get(dbName, 'CustomReport', customReportSchema);

            CustomReport.findByIdAndUpdate(_id, updateObj, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};
