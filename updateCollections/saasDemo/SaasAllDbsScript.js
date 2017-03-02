var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
require('../../models/index.js');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var url = 'mongodb://45.32.152.113:27017/mainDB';

MongoClient.connect(url, function (err, db) {
    var saasCollection = db.collection('SaasDbs');

    saasCollection.find({}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        result.forEach(function (el) {
            var dbName = el.DBname;

            var url = 'mongodb://45.32.152.113:27017/' + dbName;

            MongoClient.connect(url, function (err, db) {
                var modules = db.collection('modules');

                modules.insert({
                    _id     : 117,
                    mname   : 'Followers',
                    href    : 'followers',
                    sequence: 0,
                    parrent : 19,
                    link    : true,
                    visible : false
                }, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('good');
                });
            });
        });
    });

});