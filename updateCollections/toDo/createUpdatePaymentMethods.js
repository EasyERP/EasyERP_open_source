var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/production';
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(url, function (err, db) {
    var id = new ObjectID("555cc981532aebbc4a8baf36");

    var PaymentMethod = db.collection('PaymentMethod');

    PaymentMethod.insert({'name':'HU24 1160 0006 0000 0000 4916 1522', 'account':'HU24 1160 0006 0000 0000 4916 1522','currency':'USD','bank':'Erste Bank', 'owner':'Alexander Sokhanych'})
    PaymentMethod.insert({'name':'HU27 1160 0006 0000 0000 4810 3101', 'account':'HU27 1160 0006 0000 0000 4810 3101','currency':'EUR','bank':'Erste Bank', 'owner':'Alexander Sokhanych'})
    PaymentMethod.insert({'name':'26005536599700', 'account':'26005536599700','currency':'USD','bank':'Ukrsibbank', 'owner':'ThinkMobiles'})
    PaymentMethod.insert({'name':'26049536599700', 'account':'26049536599700','currency':'EUR','bank':'Ukrsibbank', 'owner':'ThinkMobiles'})
    PaymentMethod.insert({'name':'26005536599700', 'account':'26005536599700','currency':'UAH','bank':'Ukrsibbank', 'owner':'ThinkMobiles'})
    PaymentMethod.insert({'name':'26000479199400', 'account':'26000479199400','currency':'USD','bank':'Ukrsibbank', 'owner':'YourTradingSystems'})
    PaymentMethod.insert({'name':'26000479199400', 'account':'26000479199400','currency':'UAH','bank':'Ukrsibbank', 'owner':'YourTradingSystems'})
    PaymentMethod.update({'_id': id}, {$set: {'name':'Payoneer ', 'account':'Payoneer ','currency':'USD','bank':'', 'owner':'Payoneer '}})
    PaymentMethod.insert({'name':'Unicreditbank', 'account':'Unicreditbank','currency':'USD','bank':'', 'owner':'Unicreditbank'})
    PaymentMethod.insert({'name':'CASH USD', 'account':'CASH USD','currency':'USD','bank':'', 'owner':'CASH USD'})
    PaymentMethod.insert({'name':'CASH UAH', 'account':'CASH UAH','currency':'UAH','bank':'', 'owner':'CASH UAH'})

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('done');
});