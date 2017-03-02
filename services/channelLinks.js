'use strict';

var mongoose = require('mongoose');
var populateWrapper = require('../helpers/callbackWrapper').populate;
var ChannelLinksSchema = mongoose.Schemas.channelLinks;

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var ChannelLinksModel;
            var channelLinks;
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

            ChannelLinksModel = models.get(dbName, 'channelLinks', ChannelLinksSchema);
            channelLinks = new ChannelLinksModel(options);
            channelLinks.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.findOne = function (query, options, callback) {
            var dbName;
            var ChannelLinksModel;
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

            ChannelLinksModel = models.get(dbName, 'channelLinks', ChannelLinksSchema);
            ChannelLinksModel.findOne(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.find = function (query, options, callback) {
            var ChannelLinksModel;
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

            ChannelLinksModel = models.get(dbName, 'channelLinks', ChannelLinksSchema);

            _query = ChannelLinksModel.find(query);

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

        this.update = function (query, body, options, callback) {
            var dbName;
            var ChannelLinksModel;
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

            ChannelLinksModel = models.get(dbName, 'channelLinks', ChannelLinksSchema);
            ChannelLinksModel.update(query, body, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.remove = function (query, options, callback) {
            var Model;
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

            dbName = options.dbName;

            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'channelLinks', ChannelLinksSchema);
            Model.remove(query, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.createMulti = function (options, callback) {
            var Model;
            var dbName;
            var err;

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

            Model = models.get(dbName, 'channelLinks', ChannelLinksSchema);

            Model.collection.insertMany(options.channelLinksArray, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.importedProducts = function (dbName, callback) {
            var Model;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            Model = models.get(dbName, 'channelLinks', ChannelLinksSchema);
            Model.aggregate([
                {
                    $group: {
                        _id: {
                            channel: '$channel',
                            product: '$product'
                        }
                    }
                }, {
                    $group: {
                        _id  : '$_id.channel',
                        count: {$sum: 1}
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};
