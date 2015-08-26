// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/CRM';
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

    function parrentModule(callback) {
        var module = {
            _id: 54,
            mname: 'Purchases',
            href: 'Purchases',
            sequence: 4,
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
            _id: parrent._id + 3,
            mname: 'Order',
            href: 'Order',
            sequence: parrent.sequence + 3,
            parrent: parrent._id,
            link: true,
            visible: true
        };

        var module2 = {
            _id: parrent._id + 2,
            mname: 'Invoice',
            href: 'Invoice',
            sequence: parrent.sequence + 2,
            parrent: parrent._id,
            link: true,
            visible: true
        };

        var module3 = {
            _id: parrent._id + 1,
            mname: 'Quotation',
            href: 'Quotation',
            sequence: parrent.sequence + 1,
            parrent: parrent._id,
            link: true,
            visible: true
        };

        var module4 = {
            _id: parrent._id + 4,
            mname: 'Product',
            href: 'Product',
            sequence: parrent.sequence + 4,
            parrent: parrent._id,
            link: true,
            visible: true
        };

        var q = async.queue(function (module, callback) {
            modules.insertOne(module, callback);
        }, 1000);

        q.drain = function () {
            callback(null, parrent, module, module2, module3, module4);
        };

        q.push([module, module2, module3, module4], function () {
            console.log('finished process');
        });
    };


    function profileUpdater(parrent, child, child2, child3, child4, callback) {
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

        var childInsert2 = {
            "module": child2._id,
            "access": {
                "del": true,
                "editWrite": true,
                "read": true
            }
        };

        var childInsert3 = {
            "module": child3._id,
            "access": {
                "del": true,
                "editWrite": true,
                "read": true
            }
        };

        var childInsert4 = {
            "module": child4._id,
            "access": {
                "del": true,
                "editWrite": true,
                "read": true
            }
        };

        var q = async.queue(function (profile, callback) {
            if (profile) {
                console.log('profile = ' + profile._id);
                profiles.findOneAndUpdate({ _id: profile._id }, { $push: { profileAccess: { $each: [parrentInsert, childInsert, childInsert2, childInsert3, childInsert4] } } }, callback);
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
