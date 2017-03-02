/**
 * Created by liliy on 05.05.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
var PaymentSchema = mongoose.Schemas.wTrackPayOut;
var wTrackSchema = mongoose.Schemas.wTrack;
var QuotationSchema = mongoose.Schemas.Quotation;
var ObjectId = mongoose.Types.ObjectId;


var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w: 1,
    j: true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
    var Quotation = dbObject.model("Quotation", QuotationSchema);
    var Payment = dbObject.model("Payment", PaymentSchema);

    var count = 0;
    var countPayment = 0;
    var dueCount = 0;

    Invoice.find({}).populate('payments').exec(function (err, result) {
   if (err){
       return console.log(err);
   }

        /*result.forEach(function(invoice){
            if (invoice.paymentDate >= invoice.dueDate){
                console.log(count++);


          /!*  if (invoice.invoiceDate >= invoice.paymentDate){
                console.log('bad payment', countPayment++);
            }*!/

            var newDue = moment(invoice.invoiceDate).add(14, 'days');
                var newPaymentDate = moment(newDue).subtract(7, 'days');

                var payments = invoice.payments;

                payments.forEach(function (payment) {
                    if (payment.date <= invoice.invoiceDate){
                        Payment.findByIdAndUpdate(payment._id, {$set: {date: newPaymentDate}}, {new : true}, function (err, result) {
                            if (err){
                               return console.log(err);
                            }


                            Invoice.update({_id: result.invoice}, {$set: {paymentDate: result.date}}, function (err, result) {
                                console.log('invoiceUpdated', countPayment++);
                            });
                        });
                    }
                });


            Invoice.update({_id: invoice._id}, {$set: {dueDate: newDue}}, function (err, result) {
                if (err){
                    return console.log(err);
                }
            });

            }
        });*/

        Invoice.find({}).populate('payments').exec(function (err, result) {
            if (err){
                return console.log(err);
            }

            result.forEach(function(invoice){
                if (invoice.paymentDate >= invoice.dueDate){
                    console.log(dueCount++);


                    var newDue = moment(invoice.invoiceDate).add(14, 'days');
                    var newPaymentDate = moment(invoice.dueDate).subtract(7, 'days');

                    var payments = invoice.payments;

                    payments.forEach(function (payment) {
                        if (payment.date >= invoice.dueDate){
                            Payment.findByIdAndUpdate(payment._id, {$set: {date: newPaymentDate}}, {new : true}, function (err, result) {
                                if (err){
                                    return console.log(err);
                                }


                                Invoice.update({_id: result.invoice}, {$set: {paymentDate: result.date}}, function (err, result) {
                                    console.log('invoiceUpdated', countPayment++);
                                });
                            });
                        }
                    });


                    /*Invoice.update({_id: invoice._id}, {$set: {dueDate: newDue}}, function (err, result) {
                     if (err){
                     return console.log(err);
                     }
                     });*/

                }
            });
        });
    });
});