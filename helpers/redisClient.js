module.exports = (function () {
    "use strict";
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

        console.log("----Selected Redis DB With index = " + config.db);
    });

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.on("ready", function () {
        console.log("Redis server  is now ready to accept connections on port " + process.env.SOCKET_DB_PORT);
    });

    function writeToStorage(name, key, value) {
        client.hset(name, key, value, redis.print);
    }

    function readFromStorage(name, key, callback) {
        client.hget(name, key, function (err, value) {
            if (err) {
                callback(err);
            } else {
                callback(null, value);
            }
        });
    }

    function removeFromStorage(name, key) {
        client.hdel(name, key, redis.print);
    }

    function removeAllFromStorage(name) {
        client.del(name, redis.print);
    }

    return {
        writeToStorage   : writeToStorage,
        removeFromStorage: removeFromStorage,
        removeAllFromStorage: removeAllFromStorage,
        readFromStorage  : readFromStorage
    };
})();