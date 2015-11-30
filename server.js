require('pmx').init();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('./config/' + process.env.NODE_ENV);

var mongoose = require('mongoose');
var dbsObject = {};
var dbsNames = {};
var connectOptions = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    //replset: { rs_name: 'myReplicaSetName' },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 1,
    j: true
    //mongos: true
};
var mainDb = mongoose.createConnection(process.env.MAIN_DB_HOST, process.env.MAIN_DB_NAME, process.env.DB_PORT, connectOptions);

var app;

//var open = require('open');
mainDb.on('error', console.error.bind(console, 'connection error:'));
mainDb.once('open', function callback() {
    'use strict';

    var port = parseInt(process.env.PORT) || 8089;
    var instance = parseInt(process.env.NODE_APP_INSTANCE) || 0;

    port +=instance;
    mainDb.dbsObject = dbsObject;

    console.log("Connection to mainDB is success");

    require('./models/index.js');

    var mainDBSchema = mongoose.Schema({
        _id: Number,
        url: { type: String, default: 'localhost' },
        DBname: { type: String, default: '' },
        pass: { type: String, default: '' },
        user: { type: String, default: '' },
        port: Number
    }, { collection: 'easyErpDBS' });

    var main = mainDb.model('easyErpDBS', mainDBSchema);

    main.find().exec(function (err, result) {
        if (!err) {
            result.forEach(function (_db, index) {
                var dbInfo = {
                    DBname: '',
                    url: ''
                };
                var opts = {
                    db: { native_parser: true },
                    server: { poolSize: 5 },
                    //replset: { rs_name: 'myReplicaSetName' },
                    user: _db.user,
                    pass: _db.pass,
                    w: 1,
                    j: true
                    //mongos: true
                };
                var dbObject = mongoose.createConnection(_db.url, _db.DBname, _db.port, opts);
                dbObject.on('error', console.error.bind(console, 'connection error:'));
                dbObject.once('open', function callback() {
                    console.log("Connection to " + _db.DBname + " is success" + index);
                    dbInfo.url = result[index].url;
                    dbInfo.DBname = result[index].DBname;
                    dbsObject[_db.DBname] = dbObject;
                    dbsNames[_db.DBname] = dbInfo;
                });
            });
        } else {
            console.log(err);
        }
    });


    mainDb.mongoose = mongoose;

    app = require('./app')(mainDb, dbsNames);

    app.listen(port, function () {
        console.log('==============================================================');
        console.log('|| server start success on port=' + port + ' in ' + process.env.NODE_ENV + ' version ||');
        console.log('==============================================================\n');
    });

    //open('http://localhost:8089', "");
});
