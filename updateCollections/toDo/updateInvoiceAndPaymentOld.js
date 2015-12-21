require('../../models/index.js');

var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');
var PaymentSchema = mongoose.Schemas['Payment'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var JobsSchema = mongoose.Schemas['jobs'];
var WtrackSchema = mongoose.Schemas['wTrack'];
var objectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../../constants/mainConstants');

var moment = require('../../public/js/libs/moment/moment');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Payment = dbObject.model("Payment", PaymentSchema);
var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
var Jobs = dbObject.model("jobs", JobsSchema);
var Wtrack = dbObject.model("wTrack", WtrackSchema);
var count = 0;

var query = Payment.find({forSale: true, _type: "Payment"}).lean();
var invoices = [];
var invoicesWithOnePayment = [];
var invoicesWithoutPayment = [];
var invoicesWithManyPayment = [];
var invoicesWithBadWetracks = [];
var invoicesWithNotEqualWtrackLength = [];
var invoicesWithoutProducts = [];
var invoicesWithoutJobs = [];

query.exec(function (err, payments) {
    if (err) {
        console.log(err);
    }

    async.eachSeries(payments, function (payment, callBack) {
        Invoice.findById(payment.invoice, function (err, invoice) {
            "use strict";
            var paymentWeek;
            var paymentYear;
            var month;
            var invDate;
            var paymDate;

            if (err) {
                return callBack(err);
            }

            paymentWeek = moment(payment.date).isoWeek();
            paymentYear = moment(payment.date).year();
            month = moment(payment.date).month();

            if (invoice && invoice.invoiceDate > payment.date && paymentYear === 2015 && month === 10) {
                /* paymentWeek = moment(payment.date).isoWeek();
                 paymentYear = moment(payment.date).year();*/

                invoices.push(invoice._id);
                if (!invoice.products.length) {
                    invoicesWithoutProducts.push(invoice._id);

                    callBack();
                } else {
                    async.eachSeries(invoice.products, function (product, cb) {
                        //console.dir(product);
                        //console.log(product._doc.jobs);
                        Jobs.findById(product._doc.jobs, function (err, job) {
                            var newDate = moment(payment.date).subtract(7, 'days').toDate();

                            if (err) {
                                return cb(err);
                            }

                            if (job) {

                                Wtrack.find({_id: {$in: job.wTracks}}, function (err, wtracks) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    wtracks.forEach(function (wtrack) {
                                        if (wtrack.week > paymentWeek && wtrack.year >= paymentYear) {
                                            invoicesWithBadWetracks.push(invoice._id.toString());
                                            invoicesWithBadWetracks = _.unique(invoicesWithBadWetracks);
                                        }
                                    });

                                    if (wtracks.length !== job.wTracks.length) {
                                        invoicesWithNotEqualWtrackLength.push(invoice._id);
                                    }

                                    if (wtracks.length === job.wTracks.length && invoicesWithBadWetracks.length === 0) {
                                        invDate = moment(invoice.invoiceDate);
                                        paymDate = moment(payment.date);
                                        if(invDate.diff(paymDate, 'days') <= 1 ){
                                            console.log(invoice._id, '========== Diff less then 1 days ==========', 'from', invoice.invoiceDate, 'to', newDate);
                                            //Invoice.findByIdAndUpdate(invoice._id, {$set: {invoiceDate: payment.date, paymentDate: payment.date}}, cb);
                                        } else {
                                            console.log(invoice._id, '========== Need Update Invoice Date ==========', 'from', invoice.invoiceDate, 'to', newDate);
                                           // Invoice.findByIdAndUpdate(invoice._id, {$set: {invoiceDate: newDate, paymentDate: payment.date}}, cb);
                                        }
                                        cb();
                                    } else {
                                        cb();
                                    }
                                });
                            } else {
                                invoicesWithoutJobs.push(invoice._id);
                                cb();
                            }
                        });
                        //cb();
                    }, function (err) {
                        if (err) {
                            return callBack(err);
                        }

                        if (invoice.payments && invoice.payments.length === 1) {
                            invoicesWithOnePayment.push(invoice._id.toString());
                            invoicesWithOnePayment = _.unique(invoicesWithOnePayment);
                        } else if (invoice.payments && invoice.payments.length === 0) {
                            invoicesWithoutPayment.push(invoice);
                        } else {
                            invoicesWithManyPayment.push(invoice._id);
                        }

                        callBack();
                    });
                }
                //callBack();
            } else {
                callBack();
            }
        });
    }, function (err) {
        if (err) {
            console.error(err);
        }

        console.log('Total found', invoices.length, invoices);
        console.log('With One Payment', invoicesWithOnePayment.length);
        console.log('Without payment', invoicesWithoutPayment.length);
        console.log('Has many Payments', invoicesWithManyPayment.length, invoicesWithManyPayment);
        console.log('Invoices with bad wetracks', invoicesWithBadWetracks.length, invoicesWithBadWetracks);
        console.log('Invoices with not equal wetracl.length', invoicesWithNotEqualWtrackLength.length, invoicesWithNotEqualWtrackLength);
        console.log('Invoice without jobs', invoicesWithoutJobs.length, invoicesWithoutJobs);
        console.log('Without product', invoicesWithoutProducts.length);
        //console.dir(invoicesWithManyPayment);
    });
});
