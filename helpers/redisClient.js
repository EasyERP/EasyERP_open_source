module.exports = (function () {
    'use strict';
    var config = {
        db  : 1,
        host: process.env.SOCKET_DB_HOST || 'localhost',
        port: parseInt(process.env.SOCKET_DB_PORT, 10) || 6379
    };
    var redis = require('redis');
    var client = redis.createClient(config.port, config.host, {});

    client.select(config.db, function (err) {
        if (err) {
            throw new Error(err);
        }

        console.log('----Selected Redis DB With index = ' + config.db);
    });

    client.on('error', function (err) {
        console.log('Error ' + err);
    });

    client.on('ready', function () {
        console.log('Redis server  is now ready to accept connections on port ' + process.env.SOCKET_DB_PORT);
    });

    function writeToStorage(name, key, value) {
        return client.hset(name, key, value, redis.print);
    }

    function hSetNXToStorage(name, key, value, callback) {
        callback = callback || function () {
            };

        return client.hsetnx(name, key, value, callback);
    }

    function readFromStorage(name, key, callback) {
        callback = callback || function () {
            };
        client.hget(name, key, function (err, value) {
            if (err) {
                callback(err);
            } else {
                callback(null, value);
            }
        });
    }

    function getKeysFromStorage(name, callback) {
        return client.hkeys(name, function (err, values) {
            if (err) {
                return callback(err);
            }

            callback(null, values);
        });
    }

    function hGetAllFromStorage(name, callback) {
        client.hgetall(name, function (err, items) {
            if (err) {
                return callback(err);
            }

            callback(null, items);
        });
    }

    function removeFromStorage(name, key) {
        client.hdel(name, key, redis.print);
    }

    function removeAllFromStorage(name) {
        console.log('---------- Remove from Redish ---------');
        client.del(name, redis.print);
    }

    function removeAllStorages(callback) {

        client.keys('*', function (err, keys) {
            if (err) {
                return console.log(err);
            }

            async.each(keys, function (elem, cb) {
                client.del(elem, function (err) {
                    if (err) {
                        cb(err);
                    }
                    cb();
                });
            }, function (err) {
                if (err) {
                    return callback(err);
                }
                console.log('---------- Removed All from Redish ---------');
                callback();
            });

        });
    }

    function sAdd(key, value, callback) {
        var valuesString;

        callback = callback || function () {
            };

        if (!(value instanceof Array)) {
            return client.sadd(key, value, callback);
        }

        valuesString = value.join(' ');

        client.sadd(key, valuesString, callback);
    }

    function sMove(key, value, callback) {
        var valuesString;

        callback = callback || function () {
            };

        if (!(value instanceof Array)) {
            return client.srem(key, value, callback);
        }

        valuesString = value.join(' ');

        client.srem(key, valuesString, callback);
    }

    function sMembers(key, callback) {
        callback = callback || function () {
            };

        client.smembers(key, callback);
    }

    function sIsMember(key, value, callback) {
        callback = callback || function () {
            };

        client.sismember(key, value, function (err, reply) {
            if (err) {
                return callback(err);
            }

            callback(null, !!reply);
        });
    }

    function sPop(key, callback) {
        callback = callback || function () {

            };

        client.spop(key, function (err, item) {
            if (err) {
                return callback(err);
            }

            callback(null, item);
        });
    }

    return {
        writeToStorage      : writeToStorage,
        removeFromStorage   : removeFromStorage,
        removeAllFromStorage: removeAllFromStorage,
        readFromStorage     : readFromStorage,
        removeAllStorages   : removeAllStorages,
        getKeysFromStorage  : getKeysFromStorage,
        hGetAllFromStorage  : hGetAllFromStorage,
        sAdd                : sAdd,
        sIsMember           : sIsMember,
        sMove               : sMove,
        sMembers            : sMembers,
        hSetNXToStorage     : hSetNXToStorage
    };
})();
