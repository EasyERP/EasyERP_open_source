/*Just for test*/
var mongoose = require('mongoose');
var mainAppConfig = require('./config/main').mainApp;
var dbsObject = {};
var dbsNames = {};
var mainDb = mongoose.createConnection('localhost', 'mainDB');
var sessionParser = require('./helpers/sessionParser');
var app;

//var open = require('open');


require('./config/' + mainAppConfig.NODE_ENV);
process.env.NODE_ENV = mainAppConfig.NODE_ENV;
mainDb.on('error', console.error.bind(console, 'connection error:'));
mainDb.once('open', function callback () {
    var port = process.env.PORT || 8089;
    mainDb.dbsObject = dbsObject;

    console.log("Connection to mainDB is success");

    require('./models/index.js');

    var mainDBSchema = mongoose.Schema({
        _id: Number,
        url: { type: String, default: 'localhost' },
        DBname: { type: String, default: '' },
        pass: { type: String, default: '' },
        user: { type: String, default: '' }
    }, { collection: 'easyErpDBS' });

    var main = mainDb.model('easyErpDBS', mainDBSchema);
    main.find().exec(function (err, result) {
        if (!err) {
            result.forEach(function (_db, index) {
                var dbInfo = {
                    DBname: '',
                    url: ''
                };
                var dbObject = mongoose.createConnection(_db.url, _db.DBname);
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
