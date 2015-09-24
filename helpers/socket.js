var logger = require('../helpers/logger');
var redis = require( 'redis' );
var debug = require('debug')('handlers:socket');

var io;

function onError( err ) {
    "use strict";
    if ( err ) {
        return console.log( err.message || err );
    }
}

module.exports = function ( server ) {
    "use strict";

    if ( io ) {
        debug('Return cached socket.io');
        return io;
    }

    debug('Initialize socket.io');

    var adapter = require('socket.io-redis');
    var pub = redis.createClient(
        parseInt( process.env.SOCKET_DB_PORT ),
        process.env.SOCKET_DB_HOST,
        {
            return_buffers: true
        }
    );
    var sub = redis.createClient(
        parseInt( process.env.SOCKET_DB_PORT ),
        process.env.SOCKET_DB_HOST,
        {
            return_buffers: true
        }
    );

    io = require('socket.io')(
        server,
        {
            transports: ['websocket']
        }
    );

    pub.select( parseInt( process.env.SOCKET_DB ) );
    sub.select( parseInt( process.env.SOCKET_DB ) );

    io.adapter(
        adapter({
            pubClient: pub,
            subClient: sub
        })
    );

    pub.on('error', onError );
    sub.on('error', onError );

    return io;
};
