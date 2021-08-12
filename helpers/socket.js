"use strict";
var redis = require('redis');

var io;

function onError(err) {
    if (err) {
        console.log(err.message || err);
    }
}

module.exports = function (server) {
    var adapter = require('socket.io-redis');
    var pub = redis.createClient(
        parseInt(process.env.SOCKET_DB_PORT, 10),
        process.env.SOCKET_DB_HOST,
        {
            return_buffers: true
        }
    );
    var sub = redis.createClient(
        parseInt(process.env.SOCKET_DB_PORT, 10),
        process.env.SOCKET_DB_HOST,
        {
            return_buffers: true
        }
    );

    const options = {
        transports: [
            'websocket',
            'polling',
            'xhr-polling'
        ]
    }
    io = require('socket.io')(server, options);

    pub.select(parseInt(process.env.SOCKET_DB, 10));
    sub.select(parseInt(process.env.SOCKET_DB, 10));

    io.adapter(adapter({
        host     : process.env.SOCKET_DB_HOST,
        port     : parseInt(process.env.SOCKET_DB_PORT, 10),
        pubClient: pub,
        subClient: sub
    }));

    pub.on('error', onError);
    sub.on('error', onError);

    require('./ioHandler')(io);

    return io;
};
