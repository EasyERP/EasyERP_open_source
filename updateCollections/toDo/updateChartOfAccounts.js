var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
var ObjectId = require('mongodb').ObjectID;

MongoClient.connect(url, function (err, db) {
    var ChartOfAccount = db.collection('chartOfAccount');

    ChartOfAccount.update({'_id': 101400}, {$set: {'payMethod': ObjectId("565c5433385ea8b670ff499e")}})
    ChartOfAccount.update({'_id': 101401}, {$set: {'payMethod': ObjectId("565c5b62bc6a01997710e02c")}})
    ChartOfAccount.update({'_id': 101402}, {$set: {'payMethod': ObjectId("565c5d9adf6d008a7a6abb09")}})
    ChartOfAccount.update({'_id': 101403}, {$set: {'payMethod': ObjectId("565c5d9adf6d008a7a6abb0a")}})
    ChartOfAccount.update({'_id': 101403}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee9559")}})
    ChartOfAccount.update({'_id': 101404}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee955a")}})
    ChartOfAccount.update({'_id': 101405}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee955b")}})
    ChartOfAccount.update({'_id': 101406}, {$set: {'payMethod': ObjectId("555cc981532aebbc4a8baf36")}})
    ChartOfAccount.update({'_id': 101407}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee955c")}})
    ChartOfAccount.update({'_id': 101500}, {$set: {'payMethod': ObjectId("565c610f618d81c97e786eee")}})
    ChartOfAccount.update({'_id': 101501}, {$set: {'payMethod': ObjectId("565c610f618d81c97e786eef")}})

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('done');
});