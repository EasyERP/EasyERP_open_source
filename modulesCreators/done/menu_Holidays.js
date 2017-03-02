/**
 * Created by soundstorm on 29.06.15.
 */
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/weTrack';
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
            _id : 9,
            ancestors : [ ],
            attachments : [ ],
            href : "HR",
            link : false,
            mname : "HR",
            parrent : null,
            sequence : 3,
            visible : true
        };

        modules.findOne(module, function (err, res) {
            if (err) {
                console.error(err);
                return callback(err);
            }
            callback(null, res);
        });
    };

    function childModule(parrent, callback) {
        var module = {
            _id: 69,
            mname: 'Holidays',
            href: 'Holiday',
            sequence: 69,
            parrent: parrent._id,
            link: true,
            visible: true
        };
        var q = async.queue(function (module, callback) {
            modules.insertOne(module, callback);
        }, 1000);

        q.drain = function () {
            callback(null, parrent, module);
        };

        q.push([module], function () {
            console.log('finished process');
        });
    };


    function profileUpdater(parrent, child, callback) {
        var i;
        var parrentInsert = {
            "module": parrent._id,
            "access": {
                "del": true,
                "editWrite": true,
                "read": true
            }
        };

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
                profiles.findOneAndUpdate({ _id: profile._id }, { $push: { profileAccess: { $each: [parrentInsert, childInsert/*, childInsert2, childInsert3, childInsert4*/] } } }, callback);
            }
        }, 1000);

        q.drain = function () {
            callback(null, 'done');
        }

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


    async.waterfall([parrentModule, childModule, profileUpdater], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }

        console.log(res);
        db.close();
    })
});
