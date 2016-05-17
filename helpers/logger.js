var winston = require('winston');
var logger = new (winston.Logger)({
    transports       : [
        new (winston.transports.Console)({
            json     : false,
            timestamp: true
        }),
        new (winston.transports.File)({
            name: 'infoFile',
            filename: 'info.log',
            level: 'info',
            json     : false,
            maxsize: 1024 * 1024 * 10
        }),
        new (winston.transports.File)({
            name: 'errorFile',
            filename: 'error.log',
            json     : false,
            level: 'error',
            maxsize: 1024 * 1024 * 10
        })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({
            json     : false,
            timestamp: true
        }),
        new winston.transports.File({
            filename: 'exceptions.log',
            json    : false
        })
    ],
    exitOnError      : false
});

module.exports = logger;