/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
require('../../models/index.js');
var ModuleSchema = mongoose.Schemas.Currency;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
//var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

var Module = dbObject.model("Currency", ModuleSchema);

var insertArray = [{
    _id     : ObjectId("565eab29aeb95fa9c0f9df2d"),
    sequence: 0,
    symbol  : "$",
    name    : "USD"
},
    {
        _id     : ObjectId("565eab34aeb95fa9c0f9df2e"),
        sequence: 1,
        symbol  : "€",
        name    : "EUR"
    },
    {
        _id     : ObjectId("565eab3faeb95fa9c0f9df2f"),
        sequence: 2,
        symbol  : "₴",
        name    : "UAH"
    }
]

Module.remove({}, function (err) {
    if (err) {
        console.log(err);
    }
    Module.collection.insert(insertArray, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Good');

    });

});


