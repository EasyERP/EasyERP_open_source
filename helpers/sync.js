var async = require('async');
var redisStore = require('./redisClient');
var logger = require('./logger');
var _ = require('lodash');

module.exports = function (rm, model) {
    var _getHelper = require('./integrationHelperRetriever')(model);
    var getVersion = _getHelper.getVersion;

    function getToSync(req, res) {
        redisStore.sIsMember('nodeInProgress', 'goToSync', function (err, isMember) {
            if (isMember) {
                return;
            }
            if (err) {
                return logger.log(err);
            }
            redisStore.sAdd('nodeInProgress', 'goToSync', function () {
                redisStore.hGetAllFromStorage('integration', function (err, items) {
                    var values;

                    if (err) {
                        redisStore.sMove('nodeInProgress', 'goToSync');
                        return logger.log(err);
                    }
                    if (!items) {
                        return redisStore.sMove('nodeInProgress', 'goToSync');
                    }

                    values = Object.keys(items);

                    async.each(values, function (value, eCb) {
                        redisStore.hSetNXToStorage('sync', value, items[value], eCb);
                    }, function (err) {
                        redisStore.sMove('nodeInProgress', 'goToSync');

                        if (err) {
                            return logger.log(err);
                        }
                    });
                });
            });
        });

        res.status(200).send();
    }

    function syncAll(req, res) {
        redisStore.sIsMember('nodeInProgress', 'syncing', function (err, isMember) {
            if (isMember) {
                return;
            }

            if (err) {
                redisStore.sMove('nodeInProgress', 'syncing');
                return logger.error(err);
            }

            redisStore.sAdd('nodeInProgress', 'syncing', function (err) {
                if (err) {
                    return logger.log(err);
                }

                function readSyncData(parallelCb) {
                    redisStore.hGetAllFromStorage('sync', function (err, items) {
                        var values;

                        if (err) {
                            return parallelCb(err);
                        }

                        if (!items) {
                            return parallelCb();
                        }

                        values = Object.keys(items);

                        async.each(values, function (key, eCb) {
                            var connection;
                            var version;
                            var redisKey;
                            var dbName;
                            var result;
                            var error;
                            var type;
                            var opts;
                            var db;

                            opts = JSON.parse(items[key]);
                            redisKey = opts._id;
                            dbName = opts.dbName;
                            type = opts.type;

                            if (!dbName) {
                                console.error('dbName is not provided');

                                return eCb();
                            }

                            connection = model.connection(dbName);
                            db = connection.db;
                            db.collection('settings').findOne({
                                name: 'integration',
                                apps: {$exists: true}
                            }, function (err, setting) {
                                var message;

                                if (err) {
                                    return eCb(err);
                                }

                                version = getVersion(type);

                                if (!setting || !setting.apps || !setting.apps[type] || !setting.apps[type][version]) {
                                    error = new Error('Invalid url settings');
                                    error.status = 404;

                                    return eCb(error);
                                }

                                result = setting.apps[type][version];

                                message = _.assign(opts, {
                                    userId  : opts.user,
                                    settings: result
                                });

                                // push settings to rm Queue
                                redisStore.sIsMember('syncInProgress', dbName + '_' + redisKey, function (err, replay) {
                                    if (replay) {
                                        return redisStore.removeFromStorage('sync', key);
                                    }
                                    rm.publishMessage('sync', message, 'sync.forDataBase.' + dbName, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                    redisStore.removeFromStorage('sync', key);
                                });

                                eCb();
                                // redisStore.removeFromStorage('sync', key);
                            });
                        }, function (err) {
                            if (err) {
                                return parallelCb(err);
                            }

                            parallelCb();
                        });
                    });
                }

                function readGetAllData(parallelCb) {
                    redisStore.hGetAllFromStorage('syncGetAll', function (err, items) {
                        var values;

                        if (err) {
                            return parallelCb(err);
                        }

                        if (!items) {
                            return parallelCb();
                        }

                        values = Object.keys(items);

                        async.each(values, function (key, eCb) {
                            var dbName;
                            var opts;

                            opts = JSON.parse(items[key]);
                            dbName = opts.dbName;
                            rm.publishMessage('sync', opts, 'getAll.forDataBase.' + dbName, function (err) {
                                if (err) {
                                    logger.error(err);
                                }
                            });

                            redisStore.removeFromStorage('syncGetAll', key);
                            redisStore.hSetNXToStorage('integration', key, items[key]);

                            eCb();
                        }, function (err) {
                            if (err) {
                                return parallelCb(err);
                            }

                            parallelCb();
                        });
                    });
                }

                async.parallel([readSyncData, readGetAllData], function (err) {
                    if (err) {
                        logger.error(err);
                    }

                    redisStore.sMove('nodeInProgress', 'syncing');
                });
            });
        });

        res.status(200).send();
    }

    return {
        getToSync: getToSync,
        syncAll  : syncAll
    };
};
