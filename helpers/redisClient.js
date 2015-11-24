module.exports = (function () {
    "use strict";
    var config = {
        db  : 1,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379
    };
    //var redis = require('redis');
    //var client = redis.createClient(config.port, config.host, {});

    //client.select(config.db, function (err) {
    //    if (err) {
    //        throw new Error(err);
    //    } else {
    //        console.log("----Selected Redis DB With index = " + config.db);
    //    }
    //});

    //client.on("error", function (err) {
    //    console.log("Error " + err);
    //});
    //
    //client.on("ready", function () {
    //    console.log("Redis server  is now ready to accept connections on port " + process.env.REDIS_PORT);
    //});

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

    function removeFromStorage(key) {
        client.hdel(name, key, redis.print);
    }

    return {
        writeToStorage   : writeToStorage,
        removeFromStorage: removeFromStorage,
        readFromStorage  : readFromStorage
    }
})();