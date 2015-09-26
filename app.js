
/**
 * # This is myClass
 * @class MyClass
 * @type {exports|module.exports}
 */


module.exports = function (mainDb, dbsNames) {
    //mongoose is delegated because it encapsulated main connection

    var http = require('http');
    var path = require('path');
    var fs = require("fs");
    var express = require('express');
    var session = require('express-session');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var consolidate = require('consolidate');
    var app = express();
    var dbsObject = mainDb.dbsObject;
    var httpServer;
    var io;

    var logWriter = require('./helpers/logWriter');

    var MemoryStore = require('connect-mongo')(session);

    var sessionConfig = {
        db: mainDb.name,
        host: mainDb.host,
        port: mainDb.port,
        saveUninitialized: false,
        resave: false,
        reapInterval: 500000
    };

    var allowCrossDomain = function (req, res, next) {

        var allowedHost = [
            '185.2.100.192:8088',
            'localhost:8088',
            '192.168.88.13:8088'
        ];
        var browser = req.headers['user-agent'];

        if (/Trident/.test(browser)) {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        }

        next();
    };

    var chackMobile = function (req, res, next){
        var client = req.headers['user-agent'];
        var regExp = /mobile/i;

        if(req.session && !(req.session.isMobile === false || req.session.isMobile === true)) {
            req.session.isMobile = regExp.test(client);
        }

        next();
    };

    /*app.enable('trust proxy');*/
    app.set('dbsObject', dbsObject);
    app.set('dbsNames', dbsNames);
    app.engine('html', consolidate.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.use(logger('dev'));
    //app.use(subDomainParser);
    app.use(bodyParser.json({strict: false, inflate: false, limit: 1024 * 1024 * 200}));
    app.use(bodyParser.urlencoded({extended: false, limit: 1024 * 1024 * 200}));
    app.use(cookieParser("CRMkey"));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(session({
        name: 'crm',
        key: "CRMkey",
        secret: '1q2w3e4r5tdhgkdfhgejflkejgkdlgh8j0jge4547hh',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(sessionConfig)
    }));

    app.use(allowCrossDomain);
    app.use(chackMobile);

    httpServer = http.createServer(app);
    io = require('./helpers/socket')(httpServer);
    app.set('io', io);

    require('./routes/index')(app, mainDb);

    return httpServer;
};