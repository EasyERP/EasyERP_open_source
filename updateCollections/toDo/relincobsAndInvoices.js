/**
 * Created by lilya on 23/11/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];
var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);
    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
    var updateObj = {};
    var jobId;
    var count = 0;

    var query = Invoice.find({_type: 'wTrackInvoice'}).lean();

    query.exec(function (err, result) {
        result.forEach(function (invoice) {
           var products = invoice.products;
            var invoiceId = invoice._id;

            products.forEach(function (prod) {
                Job.findByIdAndUpdate(prod.jobs, {$set: {invoice: invoiceId}}, function (err, result) {
                    if (err){
                        return consolr.log(err);
                    }

                    console.log(count++);
                });
            });
        });

    })
});