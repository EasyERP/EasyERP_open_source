var mongoose = require('mongoose');
require('../../models/index.js');
var ObjectId = mongoose.Types.ObjectId;

var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;
var orgSettingsSchemaSchema = mongoose.Schemas.orgSettingsSchema;

var dbObject = mongoose.createConnection('144.76.56.111', 'CRM', 28017);
var Model = dbObject.model('chartOfAccount', chartOfAccountSchema);
var orgSettings = dbObject.model('orgSettings', orgSettingsSchemaSchema);

var array = [
    /*{
        "_id"     : ObjectId("565eb53a6aa50532e5df0b12"),
        "code"    : 111201,
        "account" : "VAT Payable (Sales)",
        "name"    : "111201 VAT Deductible (Sales)",
        "category": ObjectId("5810c75b2b225158086d7f88")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b17"),
        "code"    : 102001,
        "account" : "VAT Deductible (Purchase)",
        "name"    : "102001 VAT Deductible (Purchase)",
        "category": ObjectId("5810c75b2b225158086d7f84")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b18"),
        "code"    : 111202,
        "account" : "VAT Carried Forward",
        "name"    : "111202 VAT Carried Forward",
        "category": ObjectId("5810c75b2b225158086d7f88")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b19"),
        "code"    : 102002,
        "account" : "Taxes Payable",
        "name"    : "102002 Taxes Payable",
        "category": ObjectId("5810c75b2b225158086d7f84")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b20"),
        "code"    : 220001,
        "account" : "Shipping Expenses",
        "name"    : "220001 Shipping Expenses",
        "category": ObjectId("5810c75b2b225158086d7f89")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b21"),
        "code"    : 220002,
        "account" : "Sales Discount",
        "name"    : "220002 Sales Discount",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },*/
  {
    "_id"     : ObjectId("589c9cdde660d67d0f216ef4"),
    "code"    : 111004,
    "account" : "Sales Returns",
    "name"    : "111004 Sales Returns",
    "category": ObjectId("5810c75b2b225158086d7f89")
  }
];

Model.collection.insertMany(array, function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(result);
});

orgSettings.findOne({}, function (err, result) {
    if (err) {
        return console.log(err);
    }

    orgSettings.update({_id: result._id}, {
        $set: {
            salesTax   : '565eb53a6aa50532e5df0b12',
            purchaseTax: '565eb53a6aa50532e5df0b17',
            payableTax : '565eb53a6aa50532e5df0b19',
            carriedTax : '565eb53a6aa50532e5df0b18',
            shipping   : '565eb53a6aa50532e5df0b20',
            discount   : '565eb53a6aa50532e5df0b21'
        }
    }, {upsert: true}, function (err, result) {
        if (err){
            return console.log(err);
        }

        return console.log('good');
    });
});