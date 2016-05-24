/**
 * Created by lilya on 24/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');
var QuotationSchema = mongoose.Schemas['Quotation'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var objectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../../constants/mainConstants');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});


var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
var count = 0;

var query = Invoice.aggregate([{
    $match: {
        paymentDate: null,
        forSales: true,
        _type   : {$in: ["wTrackInvoice", "Proforma"]}
    }
}, {$unwind: '$payments'},
    {
        $lookup: {
            from: "Payment",
            localField: 'payments',
            foreignField: '_id',
            as: 'payments'
        }
    }, {
        $project: {
            payments: {$arrayElemAt: ['$payments', 0]}
        }
    }, {
        $group: {
            _id: '$_id',
            payments: {$push: '$payments'}
        }
    }], function (err, invoices) {
    if (err) {
        console.log(err);
    }

    async.each(invoices, function (invoice, cb) {
        var payments = invoice.payments;
        var paymentDate = payments && payments.length ? payments[0].date : 0;

        payments.forEach(function(paym){
            if (paym.date > paymentDate){
                paymentDate = paym.date;
            }
        });

        Invoice.findByIdAndUpdate(invoice._id, {$set: {paymentDate: paymentDate}}, cb);

    }, function () {
        console.log('Success');
    });
});
