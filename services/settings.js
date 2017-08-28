'use strict';

module.exports = function (models, event) {
    var _getHelper = require('../helpers/integrationHelperRetriever')(models, event);
    var getVersion = _getHelper.getVersion;

    return new function () {
        this.setSettings = function (options, callback) {
            var connection;
            var dbName;
            var err;
            var db;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            connection = models.connection(dbName);
            db = connection.db;

            db.collection('settings').findOneAndUpdate({
                dbName: dbName,
                name  : 'employeeSettings'
            }, {
                $set: {defaultProfile: parseInt(options.profileId, 10)}
            }, {
                returnOriginal: false,
                upsert        : true
            }, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getSettings = function (options, callback) {
            var connection;
            var dbName;
            var err;
            var db;

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

            connection = models.connection(dbName);
            db = connection.db;

            db.collection('settings').aggregate([{
                $match: {
                    dbName: dbName,
                    name  : 'employeeSettings'
                }
            }, {
                $lookup: {
                    from        : 'Profile',
                    localField  : 'defaultProfile',
                    foreignField: '_id',
                    as          : 'profile'
                }
            }, {
                $project: {
                    profile: {$arrayElemAt: ['$profile', 0]}
                }
            }, {
                $project: {
                    _id        : '$profile._id',
                    profileName: '$profile.profileName'
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                result = result && result[0] || {_id: 1387275598000, profileName: 'admin'};
                callback(null, result);
            });
        };

        this.findOne = function (query, options, callback) {
            var dbName;
            var err;
            var connection;
            var db;

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

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            connection = models.connection(dbName);
            db = connection.db;

            db.collection('settings').findOne(query, options, function (err, setting) {
                if (err) {
                    return callback(err);
                }

                callback(null, setting);
            });
        };

        this.getSettingsUrlsForApp = function (options, callback) {
            var dbName;
            var err;
            var connection;
            var db;
            var app;
            var version;

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

            app = options.app;
            version = getVersion(app);

            if (!dbName || !app) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            connection = models.connection(dbName);
            db = connection.db;

            db.collection('settings').findOne({name: 'integration', apps: {$exists: true}}, function (err, setting) {
                if (err) {
                    return callback(err);
                }

                console.log(setting, app, version);

                if (setting && setting.apps && setting.apps[app] && setting.apps[app][version]) {
                    return callback(null, setting.apps[app][version]);
                }

                err = new Error('Not found settingsUrls');
                err.status = 404;

                callback(err);
            });
        };
    };
};
