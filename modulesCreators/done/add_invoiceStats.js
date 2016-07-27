// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
var async = require('async');

MongoClient.connect(url, function (err, db) {

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('connected');

    var modules = db.collection('modules');

    var profiles = db.collection('Profile');


    function parrentModule(callback) {
        var module = {
            _id: 82,
            mname: 'Invoice Aging',
            href: 'invoiceAging',
            sequence: 82,
            parrent: 59,
            link: true,
            visible: true
        };

        modules.insertOne(module, function (err, res) {
            if (err) {
                console.error(err);
                return callback(err);
            }
            console.log('============== Parrent ==================');
            console.log(res.ops[0]);
            console.log('============== Parrent ==================');
            callback(null, res.ops[0]);
        });
    };

    function profileUpdater(parrent, callback) {
        var i;
        var parrentInsert = {
            "module": parrent._id,
            "access": {
                "del": true,
                "editWrite": true,
                "read": true
            }
        };

        var q = async.queue(function (profile, callback) {
            if (profile) {
                console.log('profile = ' + profile._id);
                profiles.findOneAndUpdate({ _id: profile._id }, { $push: { profileAccess: { $each: [parrentInsert] } } }, callback);
            }
        }, 1000);

        q.drain = function () {
            callback(null, 'done');
        };

        var cursor = profiles.find();


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


    async.waterfall([parrentModule, profileUpdater], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }

        console.log(res);
        db.close();
    });
});
