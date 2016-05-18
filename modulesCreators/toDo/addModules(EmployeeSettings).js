var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://144.76.56.111:28017/sergey';
var async = require('async');

MongoClient.connect(url, function (err, db) {
    var modules = db.collection('modules');
    var profiles = db.collection('Profile');

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('connected');

    function childModule(callback) {
        var module = {
            _id : 103,
            href : "settingsEmployee",
            link : true,
            mname : "Settings Employee",
            parrent : 1,
            sequence : 103,
            visible : true
        };

        var q = async.queue(function (module, callback) {
            modules.insertOne(module, callback);
        }, 1000);

        q.drain = function () {
            callback(null, module);
        };

        q.push([module], function () {
            console.log('finished process');
        });
    };

    function profileUpdater(child, callback) {
        var i;

        var childInsert = {
            "module": child._id,
            "access": {
                "del": true,
                "editWrite": true,
                "read": true
            }
        };

        var q = async.queue(function (profile, callback) {
            if (profile) {
                console.log('profile = ' + profile._id);
                profiles.findOneAndUpdate({ _id: profile._id }, { $push: { profileAccess: { $each: [childInsert] } } }, callback);
            }
        }, 1000);

        q.drain = function () {
            callback(null, 'done');
        };

        var cursor = profiles.find()


        cursor.each(function (err, profile) {
            if (err) {
                return callback(err);
            }
            if (profile) {
                q.push(profile, function () {
                    console.log('finished ' + profile._id);
                });
            }
        });
    };

    async.waterfall([childModule, profileUpdater], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }
        console.log(res);
        db.close();
    })
});