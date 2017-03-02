var mongoose = require('mongoose');
require('../../models/index.js');
var ObjectId = mongoose.Types.ObjectId;

var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;

var dbObject = mongoose.createConnection('localhost', 'CRM');
var Model = dbObject.model('chartOfAccount', chartOfAccountSchema);

var array = [
    /*{
        "_id"     : ObjectId("565eb53a6aa50532e5df0b15"),
        "code"    : 201001,
        "account" : "Unrealized Exchange Gain",
        "type"    : ObjectId("57da4d62713d3fe825f074bb"),
        "name"    : "201001 Unrealized Exchange Gain",
        "category": ObjectId("5810c75b2b225158086d7f83")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b16"),
        "code"    : 211001,
        "account" : "Unrealized Exchange Loss",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "211001 Unrealized Exchange Loss",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },*/ {
        "_id"       : ObjectId("5853a166cd4751bc2b831b0f"),
        "code"      : 101300,
        "createdBy" : {
            "date": "2016-12-16T08:10:14.180Z",
            "user": null
        },
        "editedBy"  : {
            "user": null
        },
        "payMethod" : null,
        "budgeted"  : false,
        "category"  : ObjectId("5810c75b2b225158086d7f80"),
        "subAccount": null,
        "name"      : "101300 Tax Paid",
        "account"   : "Tax Paid",
        "__v"       : 0
    }
];

Model.collection.insertMany(array, function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(result);
});

Model.update({_id: {$in: ['56c9d4c7c3b88f6d64490fb4', '56cc6b62541812c071973569', '565eb53a6aa50532e5df0bed', '565eb53a6aa50532e5df0bf1']}}, {$set: {budgeted: true}}, {multi: true}, function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(result);

});
