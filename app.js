module.exports = function (mainDb, dbsNames) {
    'use strict';

    var http = require('http');
    var path = require('path');
    var express = require('express');
    // var compression = require('compression');
    var session = require('express-session');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var consolidate = require('consolidate');
    var app = express();
    var dbsObject = mainDb.dbsObject;
    var sessionConfig = require('./config/session')(mainDb, session);
    var crypto = require('crypto');

    var allowCrossDomain = function (req, res, next) {
        var browser = req.headers['user-agent'];

        if (/Trident|Edge/.test(browser)) {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        }

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-HTTP-Method-Override, uid, hash, mid');

        if (req.session && !req.session.host) {
            req.session.host = req.headers.host;
            req.session.baseUrl = req.baseURI;
        }

        next();

    };
    var chackMobile = function (req, res, next) {
        var client = req.headers['user-agent'];
        var regExp = /mobile/i;

        if (req.session && !(req.session.isMobile === false || req.session.isMobile === true)) {
            req.session.isMobile = regExp.test(client);
        }
        next();

    };
    var httpServer;
    var io;

    app.set('dbsObject', dbsObject);
    app.set('dbsNames', dbsNames);
    app.engine('html', consolidate.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    global.appRoot = path.resolve(__dirname);
    // app.use(compression());
    app.use(logger('dev'));
    app.use(bodyParser.json({
        strict : false,
        inflate: true,
        limit  : 1024 * 1024 * 200,
        verify : function (req, res, buf) {
            var shopHMAC = req.get('x-shopify-hmac-sha256');

            if (!shopHMAC) {
                return;
            }

            if (req.get('x-kotn-webhook-verified')) {
                throw new Error('Unexpected webhook verified header');
            }

            req.buf = buf;
        }
    }));
    app.use(bodyParser.urlencoded({extended: false, limit: 1024 * 1024 * 200}));
    app.use(cookieParser('PaaS'));
    app.use('/developer/apidocs', express.static(__dirname + '/apidoc'));

    // todo uncomment it in production
    /* if (process.env.NODE_ENV !== 'production') {
     app.use(express.static(path.join(__dirname, 'public')));
     } */
    // todo comment it in production
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/customImages', express.static(path.join(__dirname, 'customImages')));

    app.use(session(sessionConfig));

    app.use(allowCrossDomain);
    app.use(chackMobile);

    httpServer = http.createServer(app);
    io = require('./helpers/socket')(httpServer);

    app.set('io', io);

    require('./routes/index')(app, mainDb);

    return httpServer;
};