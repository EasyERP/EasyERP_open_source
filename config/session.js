'use strict';
var MongoStore = require('connect-mongo');
module.exports = function (connection, session) {
    process.env.SESSION_MAX_AGE = Number(31 * 24 * 60 * 60 * 1000);

    return {
        name             : 'pwd',
        secret           : 'kdf78945jhnedih62hAsJJ%$hjjshfdKhwger423,cmnbdfnbgfhtyr908765yt1',
        resave           : false,
        rolling          : true,
        saveUninitialized: false,
        store            : process.env.isDev ? new session.MemoryStore() : MongoStore.create({clientPromise: connection}),

        cookie: {
            path  : '/',
            maxAge: Number(process.env.SESSION_MAX_AGE)
        }
    };
};
