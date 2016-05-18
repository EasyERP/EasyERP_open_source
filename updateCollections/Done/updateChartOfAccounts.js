var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
var ObjectId = require('mongodb').ObjectID;

MongoClient.connect(url, function (err, db) {
    var ChartOfAccount = db.collection('chartOfAccount');

    ChartOfAccount.update({'code': 101400}, {$set: {'payMethod': ObjectId("565c5433385ea8b670ff499e")}})
    ChartOfAccount.update({'code': 101401}, {$set: {'payMethod': ObjectId("565c5b62bc6a01997710e02c")}})
    ChartOfAccount.update({'code': 101402}, {$set: {'payMethod': ObjectId("565c5d9adf6d008a7a6abb09")}})
    ChartOfAccount.update({'code': 101403}, {$set: {'payMethod': ObjectId("565c5d9adf6d008a7a6abb0a")}})
    ChartOfAccount.update({'code': 101403}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee9559")}})
    ChartOfAccount.update({'code': 101404}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee955a")}})
    ChartOfAccount.update({'code': 101405}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee955b")}})
    ChartOfAccount.update({'code': 101406}, {$set: {'payMethod': ObjectId("555cc981532aebbc4a8baf36")}})
    ChartOfAccount.update({'code': 101407}, {$set: {'payMethod': ObjectId("565c6059b8078e097eee955c")}})
    ChartOfAccount.update({'code': 101500}, {$set: {'payMethod': ObjectId("565c610f618d81c97e786eee")}})
    ChartOfAccount.update({'code': 101501}, {$set: {'payMethod': ObjectId("565c610f618d81c97e786eef")}})

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('done');
});