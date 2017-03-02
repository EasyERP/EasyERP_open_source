var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var PaymentSchema = mongoose.Schemas.wTrackPayOut;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var journalSchema = mongoose.Schemas.journal;
var InvoiceSchema = mongoose.Schemas.Invoice;
var ObjectId = mongoose.Types.ObjectId;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('../../config/environment/' + process.env.NODE_ENV);

var oxr = require('open-exchange-rates');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'CRM', 27017);
// var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Payment = dbObject.model("Payment", PaymentSchema);
    var JE = dbObject.model("journalEntry", journalEntrySchema);
    var Invoice = dbObject.model('Invoice', InvoiceSchema);

    var query = Payment.find({
        "_type": {$in: ["dividendInvoicePayment", "expensesInvoicePayment"]}
    }).populate('invoice').lean();
    var count = 0;

    var queryInvoice = Invoice.find({_type: {$in: ['expensesInvoice', 'dividendInvoice']}});

    query.exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (paym, cb) {
            var name = paym.invoice.name;
            var timeStamp = new Date();
            var timeStampDate = new Date(paym.date);

            var timestamp = timeStamp.valueOf() + timeStampDate.valueOf() + new ObjectId();


            JE.update({'sourceDocument._id': paym._id}, {
                $set: {
                    'sourceDocument.name': name,
                    timestamp            : timestamp
                }
            }, {multi: true}, cb);
        }, function () {
            console.log('good');
        });
    });

    queryInvoice.exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (inv, cb) {
            var name = inv.name;
            var timeStamp = new Date();
            var timeStampDate = new Date(inv.invoiceDate);

            var timestamp = timeStamp.valueOf() + timeStampDate.valueOf() + new ObjectId();


            JE.update({'sourceDocument._id': inv._id}, {
                $set: {
                    'sourceDocument.name': name,
                    timestamp            : timestamp
                }
            }, {multi: true}, cb);
        }, function () {
            console.log('good');
        });
    })
});