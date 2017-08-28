var CONSTANTS = require('../constants/mainConstants');
var async = require('async');
var mongoose = require('mongoose');
var SyncSchema = mongoose.Schemas.syncLogs;
var ObjectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    'use strict';

    var SyncLogsService = function () {
        this.create = function (options, callback) {
            var SyncModel;
            var syncModel;
            var dbName;
            var error;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete  options.dbName;

            if (!dbName) {
                error = new Error('Invalid input parameters / dbName');
                error.status = 400;

                return callback(error);
            }

            SyncModel = models.get(dbName, 'syncLogs', SyncSchema);
            syncModel = new SyncModel(options.logs);
            syncModel.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                return callback(null, model);
            });
        };

        this.getLastById = function (options, callback) {
            var id = options.id;
            var SyncModel;
            var dbName;
            var error;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete  options.dbName;

            if (!dbName) {
                error = new Error('Invalid input parameters / dbName');
                error.status = 400;

                return callback(error);
            }

            SyncModel = models.get(dbName, 'syncLogs', SyncSchema);

            SyncModel.aggregate([{
                $match: {channel: ObjectId(id)}
            }, {
                $sort: {date: -1}
            }, {
                $limit: 1
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'user',
                    foreignField: '_id',
                    as          : 'user'
                }
            }, {
                $lookup: {
                    from        : 'integrations',
                    localField  : 'channel',
                    foreignField: '_id',
                    as          : 'channel'
                }
            }, {
                $project: {
                    _id                : 1,
                    imports            : 1,
                    exports            : 1,
                    criticalErrorsCount: 1,
                    errorsCount        : 1,
                    status             : 1,
                    date               : 1,
                    user               : {$arrayElemAt: ['$user', 0]},
                    channel            : {$arrayElemAt: ['$channel', 0]}
                }
            }]).exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);

            });
        };

    };

    return new SyncLogsService();
};
