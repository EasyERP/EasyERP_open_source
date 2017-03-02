var winston = require('winston');
var path = require('path');
var basePath = path.join(__dirname, '..');
var info = path.join(basePath, 'info.log');
var error = path.join(basePath, 'error.log');
var exception = path.join(basePath, 'exceptions.log');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json     : false,
            timestamp: true
        }),

        new (winston.transports.File)({
            name    : 'infoFile',
            filename: info,
            level   : 'info',
            json    : false,
            maxsize : 1024 * 1024 * 10
        }),

        new (winston.transports.File)({
            name    : 'errorFile',
            filename: error,
            json    : false,
            level   : 'error',
            maxsize : 1024 * 1024 * 10
        })
    ],

    exceptionHandlers: [
        new (winston.transports.Console)({
            json     : false,
            timestamp: true
        }),
        new winston.transports.File({
            filename: exception,
            json    : false
        })
    ],

    exitOnError: false
});

module.exports = logger;
