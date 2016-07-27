// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/CRM';
var url = 'mongodb://localhost:27017/mainDB';
//var url = 'mongodb://localhost:27017/testCrm';
var async = require('async');

MongoClient.connect(url, function (err, db) {

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('connected');

    var SaasDb = db.collection('SaasDbs');

    var findById = function (callback) {
        var id = 'romashka50';
        var firstUser;
        var pass = 'bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a';

        SaasDb.findOne({ _id: id }, function (err, doc) {
            if (err) {
                return callback(err);
            }
            firstUser = doc.users[0];
            console.log(firstUser);
            firstUser.pass = pass;

            SaasDb.updateOne({ _id: id }, { $set: { users: [firstUser] } }, callback);
        });
    }

    async.series([findById/*, updateFoundDb*/], function (err, res) {
        if (err) {
            db.close();
            return console.log(err);
        }

        console.log(res);
        db.close();
    })

    findById();
});
