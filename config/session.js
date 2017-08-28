'use strict';

module.exports = function (connection, Store) {
    process.env.SESSION_MAX_AGE = 31 * 24 * 60 * 60 * 1000;

    return {
        name             : 'paas',
        secret           : 'kdf78945jhnedih62hAsJJ%$hjjshfdKhwger423,cmnbdfnbgfhtyr908765ytu',
        resave           : false,
        rolling          : true,
        saveUninitialized: false,
        store            : new Store({
            mongooseConnection: connection,
            reapInterval      : 500000
        }),

        cookie: {
            path  : '/',
            //domain: 'live.easyerp.com',
            maxAge: process.env.SESSION_MAX_AGE
        }
    };
};
