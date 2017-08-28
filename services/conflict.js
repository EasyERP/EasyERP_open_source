'use strict';

var mongoose = require('mongoose');
var MatchSchema = mongoose.Schemas.matchMagento;
var _ = require('lodash');
var populateWrapper = require('../helpers/callbackWrapper').populate;

module.exports = function (models) {
    var ConflictService = function () {
        this.create = function (options, callback) {
            var dbName;
            var MatchModel;
            var match;
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

            MatchModel = models.get(dbName, 'matchMagento', MatchSchema);
            match = new MatchModel(options);
            match.save(function (err, conflict) {
                if (err) {
                    return callback(err);
                }

                callback(null, conflict);
            });
        };

        this.find = function (query, options, callback) {
            var MatchModel;
            var dbName;
            var err;
            var cursor;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            MatchModel = models.get(dbName, 'matchMagento', MatchSchema);
            cursor = MatchModel.find(query);

            if (typeof callback !== 'function') {
                return cursor;
            }

            cursor.exec(function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });
        };

        this.findOne = function (query, options, callback) {
            var MatchModel;
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
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            MatchModel = models.get(dbName, 'matchMagento', MatchSchema);
            MatchModel.findOne(query, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.findOneAndRemove = function (query, options, callback) {
            var MatchModel;
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
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            MatchModel = models.get(dbName, 'matchMagento', MatchSchema);
            MatchModel.findOneAndRemove(query, options, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.remove = function (query, options, callback) {
            var MatchModel;
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
            delete options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            MatchModel = models.get(dbName, 'matchMagento', MatchSchema);
            MatchModel.remove(query, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
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

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
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

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.findOneAndUpdate(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findByIdAndUpdate = function (id, updateObject, options, callback) {
            var _options = {};
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

            if (!id || !updateObject || typeof updateObject !== 'object') {
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

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.findByIdAndUpdate(id, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.count = function (options, callback) {
            var Model;
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
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.count(options, function (err, count) {
                if (err) {
                    return callback(err);
                }

                callback(null, count);
            });
        };

        this.importedConflicts = function (dbName, callback) {
            var Model;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.aggregate([
                {
                    $match: {
                        entity: 'Product'
                    }
                },
                {
                    $group: {
                        _id  : '$fields.channel',
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

        this.getConflicts = function (query, dbName, callback) {
            var Model;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.aggregate([
                {
                    $match: query
                }, {
                    $match: {
                        entity: 'Product',
                        type  : {$exists: false}
                    }
                }, {
                    $lookup: {
                        from        : 'integrations',
                        localField  : 'fields.channel',
                        foreignField: '_id',
                        as          : 'channel'
                    }
                }, {
                    $project: {
                        channel: {$arrayElemAt: ['$channel', 0]},
                        fields : 1
                    }
                }, {
                    $project: {
                        'fields.channel': {
                            channelType: '$channel.type',
                            channelName: '$channel.channelName',
                            id         : '$channel._id'
                        },

                        'fields.info.SKU': 1,
                        'fields.name'    : 1
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getUnlinkedProdByOrder = function (dbName, query, callback) {
            var Model;
            var err;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Model = models.get(dbName, 'matchMagento', MatchSchema);
            Model.aggregate([
                {
                    $match: query
                }, {
                    $lookup: {
                        from        : 'matchMagento',
                        localField  : 'fields.product',
                        foreignField: '_id',
                        as          : 'unlinkedProducts'
                    }
                }, {
                    $unwind: '$unlinkedProducts'
                }, {
                    $project: {
                        _id   : '$unlinkedProducts._id',
                        fields: '$unlinkedProducts.fields'
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

    return new ConflictService();
};
