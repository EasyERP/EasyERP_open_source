// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/CRM';
//var url = 'mongodb://localhost:27017/EasyERP';
//var url = 'mongodb://localhost:27017/testCrm';
var async = require('async');

MongoClient.connect(url, function (err, db) {

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('connected');

    var modules = db.collection('modules');

    function moduleFinder(callback) {
        var mname = 'Settings';
        var query = {
            mname: mname,
            parrent : null
        };
        var projection = {
            _id: 1
        };

        modules.findOne(query, projection, function (err, module) {
            if (err) {
                return callback(err);
            }

            callback(null, module._id);
        });
    }
      
    function modulesUpdater(parrentId, callback) {
        var query = {
            parrent: parrentId
        };

        var q = modules.find(query, projection, function (err, module) {
            if (err) {
                return callback(err);
            }

            callback(null, module._id);
        });
    }

    async.waterfall([moduleFinder, modulesFinder], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }

        console.log(res);
        db.close();
    })
});
