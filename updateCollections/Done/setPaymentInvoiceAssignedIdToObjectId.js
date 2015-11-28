var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(url, function (err, db) {

    var Payment = db.collection('Payment');

    Payment.find({forSale: true}).forEach(function (model) {
        var id = model.invoice.assigned._id;

        if (typeof id === 'string') {
            model.invoice.assigned._id = ObjectID(id);
            Payment.save(model);
        }
    });

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('done');
});