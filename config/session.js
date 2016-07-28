'use strict';

module.exports = function (connection, Store) {
    return {
        name             : 'crm',
        key              : 'CRMkey',
        secret           : '1q2w3e4r5tdhgkdfhgejflkejgkdlgh8j0jge4547hh',
        resave           : false,
        rolling          : true,
        saveUninitialized: false,
        store            : new Store({
            mongooseConnection: connection
        }),

        cookie: {
            maxAge: 31 * 24 * 60 * 60 * 1000 // One month
        }
    };
};
