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
        parseInt(process.env.SOCKET_DB_PORT),
        process.env.SOCKET_DB_HOST,
        {
            return_buffers: true
        }
    );

    io = require('socket.io')(
        server
    );

    io.set('transports', [
        'websocket',
        'polling',
        'xhr-polling'
    ]);

    pub.select(parseInt(process.env.SOCKET_DB));
    sub.select(parseInt(process.env.SOCKET_DB));

    io.adapter(adapter({
        host     : process.env.SOCKET_DB_HOST,
        port     : parseInt(process.env.SOCKET_DB_PORT),
        pubClient: pub,
        subClient: sub
    }));

    pub.on('error', onError);
    sub.on('error', onError);

    require('./ioHandler')(io);

    return io;
};
