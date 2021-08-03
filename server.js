'use strict';

var mongoose = require('mongoose');
const util = require('util');
var async = require('async');
var dbsObject = {};
var models = require('./helpers/models')(dbsObject);
var dbsNames = {};
var connectOptions;
var mainDb;
var app;

require('pmx').init();

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('./config/environment/' + process.env.NODE_ENV);

connectOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};
// mongodb://user:pass@localhost:port/database
const mongoMainDbUri = util.format('mongodb://%s:%s/%s', process.env.MAIN_DB_HOST, process.env.DB_PORT, process.env.MAIN_DB_NAME);
mainDb = mongoose.createConnection(mongoMainDbUri, connectOptions);
mainDb.on('error', function (err) {
    err = err || 'connection error';
    console.error(err);
    process.exit(1, err);
});
mainDb.once('open', function callback() {
    var mainDBSchema;
    var port = parseInt(process.env.PORT, 10) || 8089;
    var instance = parseInt(process.env.NODE_APP_INSTANCE, 10) || 0;
    var main;

    port += instance;
    mainDb.dbsObject = dbsObject;

    dbsObject.mainDB = mainDb;

    console.log('Connection to mainDB is success');

    require('./models/index.js');

    mainDBSchema = mongoose.Schema({
        _id   : Number,
        url   : {type: String, default: 'localhost'},
        DBname: {type: String, default: ''},
        pass  : {type: String, default: ''},
        user  : {type: String, default: ''},
        port  : Number
    }, {collection: 'easyErpDBS'});

    main = mainDb.model('easyErpDBS', mainDBSchema);
    main.find().exec(function (err, result) {
        if (err) {
            process.exit(1, err);
        }

        async.each(result, function (_db, eachCb) {
            var dbInfo = {
                DBname: '',
                url   : ''
            };

            // mongodb://user:pass@host:port/database
            const dbUri = util.format('mongodb://%s:%d/%s', _db.url, _db.port, _db.DBname);
            var dbObject = mongoose.createConnection(dbUri, connectOptions);

            dbObject.on('error', function (err) {
                console.error(err);
                eachCb(err);
            });
            dbObject.once('open', function () {
                console.log('Connection to ' + _db.DBname + ' is success');

                dbInfo.url = _db.url;
                dbInfo.DBname = _db.DBname;
                dbsObject[_db.DBname] = dbObject;
                dbsNames[_db.DBname] = dbInfo;

                eachCb();
            });
        }, function (err) {
            if (err) {
                return console.error(err);
            }
            app = require('./app')(mainDb, dbsNames);

            app.listen(port, function () {
                var Scheduler = require('./services/scheduler')(models);
                var scheduler = new Scheduler(dbsObject);

                console.log('==============================================================');
                console.log('|| server instance=' + instance + ' start success on port=' + port + ' in ' + process.env.NODE_ENV + ' version ||');
                console.log('==============================================================\n');

                if (result.length > 0) {
                    scheduler.initEveryDayScheduler();
                }
            });
        });
    });

    mainDb.mongoose = mongoose;
});


