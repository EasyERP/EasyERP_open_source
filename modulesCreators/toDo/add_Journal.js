/**
 * Created by liliya on 9/10/15.
 */
// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
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
    var profiles = db.collection('Profile');

    function childModule(callback) {
        var module = {
            _id     : 85,
            mname   : 'Journal',
            href    : 'journal',
            sequence: 85,
            parrent : 59,
            link    : true,
            visible : true
        };

        var module2 = {
            _id     : 86,
            mname   : 'Journal Entry',
            href    : 'journalEntry',
            sequence: 86,
            parrent : 59,
            link    : true,
            visible : true
        };

        var q = async.queue(function (module, callback) {
            modules.insertOne(module, callback);
        }, 1000);

        q.drain = function () {
            callback(null, module, module2);
        };

        q.push([module, module2], function () {
            console.log('finished process');
        });
    };


    function profileUpdater(child, child2, callback) {
        var i;

        var childInsert = {
            "module": child._id,
            "access": {
                "del"      : true,
                "editWrite": true,
                "read"     : true
            }
        };
        var childInsert2 = {
            "module": child2._id,
            "access": {
                "del"      : true,
                "editWrite": true,
                "read"     : true
            }
        };


        var q = async.queue(function (profile, callback) {
            if (profile) {
                console.log('profile = ' + profile._id);
                profiles.findOneAndUpdate({_id: profile._id}, {$push: {profileAccess: {$each: [childInsert, childInsert2]}}}, callback);
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


    async.waterfall([childModule, profileUpdater], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }

        console.log(res);
        db.close();
    })
});
