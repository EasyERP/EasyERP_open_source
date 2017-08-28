var async = require('async');
var redisStore = require('./redisClient');
var logger = require('./logger');
var _ = require('lodash');
var mongoose = require('mongoose');
var CONSTANTS = require('../constants/mainConstants');

module.exports = function (rm, model, event) {
    var _getHelper = require('./integrationHelperRetriever')(model, event);
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
        console.log('syncAll');
        redisStore.sIsMember('nodeInProgress', 'syncing', function (err, isMember) {
            if (isMember) {
                console.log('Is Member: ' + isMember);
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
                          console.log(isMember);
                            return parallelCb();
                        }

                      console.log('readSyncData');

                      values = Object.keys(items);

                        console.log('values: ' + values);

                        async.each(values, function (key, eCb) {
                            console.log('line 97', key);
                            var connection;
                            var version;
                            var redisKey;
                            var message;
                            var dbName;
                            var result;
                            var error;
                            var type;
                            var opts;
                            var db;
                            var dbConnection;

                            opts = JSON.parse(items[key]);
                            redisKey = opts._id;
                            dbName = opts.dbName;
                            type = opts.type;

                            if (!dbName) {
                                console.error('dbName is not provided');

                                return eCb();
                            }

                            message = _.assign(opts, {
                                userId: opts.user
                            });

                            connection = model.connection(dbName);

                            if (!connection) {
                                dbConnection = mongoose.createConnection('localhost', dbName, {
                                  db    : {native_parser: true},
                                  user  : dbName,
                                  pass  : dbName
                                });//{ server: { poolSize: 2 } }
                                dbConnection.once('open', function () {
                                    db = dbConnection.db;
                                    db.collection('settings').findOne({
                                        name: 'integration',
                                        apps: {$exists: true}
                                    }, function (err, setting) {
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
                                });
                                dbConnection.on('error', function (error) {
                                    dbConnection.close();
                                    eCb();
                                });
                            } else {
                                db = connection.db;
                                db.collection('settings').findOne({
                                    name: 'integration',
                                    apps: {$exists: true}
                                }, function (err, setting) {
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
                                            console.log('removed 192', replay);
                                            return redisStore.removeFromStorage('sync', key);
                                        }
                                        rm.publishMessage('sync', message, 'sync.forDataBase.' + dbName, function (err) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                        console.log('removed 199');
                                        redisStore.removeFromStorage('sync', key);
                                    });

                                    eCb();
                                    // redisStore.removeFromStorage('sync', key);
                                });
                            }

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

                      console.log('readGetAllData');

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

                            console.log('Remover from SyncGetAll', dbName);
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
                        return logger.error(err);
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
