var mongoose = require('mongoose');
var _ = require('underscore');
var CustomDashboardSchema = mongoose.Schemas.CustomDashboard;

module.exports = function (models) {
    return new function () {
        this.get = function (options, callback) {
            var dbName;
            var Model;
            var query;
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

            query = options.query || {};

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'CustomDashboard', CustomDashboardSchema);

            Model.find(query).find({_id: {$ne: '582bfabf5a43a4bc2524bf09'}}).populate('editedBy.user', 'login favorite').exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getRecent = function (options, callback) {
            var dbName;
            var Model;
            var err;
            var query;

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

            query = options.query || {};

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'CustomDashboard', CustomDashboardSchema);

            Model.find(query).find({_id: {$ne: '582bfabf5a43a4bc2524bf09'}}).sort({recentDate: -1}).limit(5).populate('editedBy.user', 'login favorite').exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });

        };

        this.update = function (options, callback) {
            var dbName;
            var Model;
            var err;
            var query;
            var data = options.data;

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

            query = options.query || {};

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'CustomDashboard', CustomDashboardSchema);
            Model.update(query, {$set: data}, function (err, result) {
                if (err) {
                    return callback(err);
                }
                callback(null, result);
            });
        }
    };
};
