var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
var async = require('async');

MongoClient.connect(url, function (err, db) {

    var PayRoll = db.collection('PayRoll');

    PayRoll.update({}, {$set: {status: false, date: null}}, {multi: true});

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('done');
});