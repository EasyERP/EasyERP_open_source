/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var ModuleSchema = mongoose.Schemas.PaymentTerm;
var ObjectId = mongoose.Types.ObjectId;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

 var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
//var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

var Module = dbObject.model("PaymentTerm", ModuleSchema);

var insertArray = [{
    _id : ObjectId('55536e52475b7be475f335f6'),
    name : 'Net 15',
    count  : '15'
},{
    _id : ObjectId('55536e52475b7be475f335f7'),
    name : 'Net 30',
    count  : '30'
}, {
    _id : ObjectId('55536e52475b7be475f335f8'),
    name : 'Net 45',
    count  : '45'
}, {
        _id : ObjectId('55536e52475b7be475f335f9'),
        name : 'Net 60',
        count  : '60'
    },
    {
        _id : ObjectId('55536e52475b7be475f335fa'),
        name : 'Custom'
    },
    {
        _id : ObjectId('55536e52475b7be475f335fb'),
        name : 'Due on Receipt'
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


