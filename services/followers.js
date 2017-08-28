'use strict';

var mongoose = require('mongoose');
var followersSchema = mongoose.Schemas.followers;
var _ = require('lodash');
var populateWrapper = require('../helpers/callbackWrapper').populate;

module.exports = function (models) {
    return new function () {
        // todo complete it
        this.create = function (options, callback) {
            var dbName;
            var FollowersModel;
            var follower;
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

            FollowersModel = models.get(dbName, 'followers', followersSchema);
            follower = new FollowersModel(options);
            follower.save(function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });

        };

        this.find = function (query, projection, options, callback) {
            var _options = {new: true};
            var argumentsLength = arguments.length;
            var FollowersModel;
            var dbName;
            var _query;
            var err;

            if (argumentsLength) {
                callback = arguments[argumentsLength - 1];

                if (typeof callback !== 'function') {
                    callback = null;

                    if (projection && projection.dbName) {
                        options = projection;
                        projection = {};
                    }
                } else if (argumentsLength === 3) {
                    options = projection;
                    projection = {};
                } else if (argumentsLength === 2) {
                    options = {};
                    projection = {};
                }
            }

            if (typeof projection !== 'object') {
                projection = {};
            }

            if (typeof options !== 'object') {
                options = {};
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            FollowersModel = models.get(dbName, 'followers', followersSchema);
            _query = FollowersModel.find(query, projection, _options);

            if (typeof callback !== 'function') {
                return _query;
            }

            _query.exec(function (err, followers) {
                if (err) {
                    return callback(err);
                }

                callback(null, followers);
            });
        };

        this.aggregateFind = function (_id, options, callback) {
            var FollowersModel;
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

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            FollowersModel = models.get(dbName, 'followers', followersSchema);
            FollowersModel.aggregate([{
                $match: {
                    contentId: _id
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'followerId',
                    foreignField: '_id',
                    as          : 'follower'
                }
            }, {
                $project: {
                    follower      : {$arrayElemAt: ['$follower', 0]},
                    collectionName: 1,
                    contentId     : 1,
                    date          : 1,
                    editedBy      : 1,
                    createdBy     : 1
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'follower.relatedEmployee',
                    foreignField: '_id',
                    as          : 'employee'
                }
            }, {
                $project: {
                    follower      : 1,
                    employee      : {$arrayElemAt: ['$employee', 0]},
                    collectionName: 1,
                    contentId     : 1,
                    date          : 1,
                    editedBy      : 1,
                    createdBy     : 1
                }
            }, {
                $project: {
                    follower      : 1,
                    followerName  : {
                        $cond: ['$employee', {
                            $concat: ['$employee.name.first', ' ', '$employee.name.last']
                        },
                            '$follower.login']
                    },
                    collectionName: 1,
                    contentId     : 1,
                    date          : 1,
                    editedBy      : 1,
                    createdBy     : 1
                }
            }], function (err, docs) {
                if (err) {
                    return callback(err);
                }

                callback(null, docs);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var _options = {};
            var FollowersModel;
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

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            FollowersModel = models.get(dbName, 'followers', followersSchema);
            FollowersModel.findByIdAndRemove(_id, _options, function (err, follower) {
                if (err) {
                    return callback(err);
                }

                callback(null, follower);
            });
        };
    }
        ;
}
;
