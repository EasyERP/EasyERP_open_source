// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/development';
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
            _id: 78,
            mname: 'Payroll',
            href: 'Payroll',
            sequence: 78,
            parrent: null,
            link: false,
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

    function childModule(parrent, callback) {
        var module = {
            _id: parrent._id + 1,
            mname: 'Payroll Payments',
            href: 'PayRollPayments',
            sequence: parrent.sequence + 1,
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

    function modulesUpdater(parrent, module, callback) {
        var _modules = [66, 68, 69, 76, 72];

        modules.update({_id: {$in: _modules}}, {$set: {parrent: parrent._id}}, {multi: true}, function(err){
            "use strict";
            if(err){
                return callback(err);
            }

            modules.update({_id: 66}, {$set: {mname: "Payroll Expenses", href: "PayrollExpenses"}}, {multi: true}, function(err){
                "use strict";
                if(err){
                    return callback(err);
                }

                callback(null, parrent, module);
            });
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
                profiles.findOneAndUpdate({ _id: profile._id }, { $push: { profileAccess: { $each: [parrentInsert, childInsert] } } }, callback);
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


    async.waterfall([parrentModule, childModule, modulesUpdater, profileUpdater], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }

        console.log(res);
        db.close();
    });
});
