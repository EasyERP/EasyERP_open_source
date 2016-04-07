
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');


var InvoiceSchema = mongoose.Schemas.Invoice;

var connectOptions = {
    user  : 'easyerp',
    pass  : '1q2w3e!@#',
    w     : 1,
    j     : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'maxdb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Invoice = dbObject.model("Employees", InvoiceSchema);

var query = Invoice.aggregate([{
    $unwind: "$payments"
},
    {
        $lookup: {
            from        : "Payment",
            localField  : "payments",
            foreignField: "_id", as: "payments"
            }
    },
    {
        $project: {
            payments: {$arrayElemAt: ["$payments", 0]},
            paymentInfo: 1
        }
    },
    {
       $group: {
           _id: "$_id",
           "paid": {$sum: "$payments.paidAmount"}
       }
    }
    ]);

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (inv, callback) {
        var objectToSave = {};

        objectToSave['paymentInfo.paid'] = inv.paid;

        Invoice.update({_id: inv._id}, objectToSave, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});