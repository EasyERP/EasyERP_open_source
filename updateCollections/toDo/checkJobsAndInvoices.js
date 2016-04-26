/**
 * Created by liliy on 26.04.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var JobsSchema = mongoose.Schemas.jobs;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var journalSchema = mongoose.Schemas.journal;
var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];


var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);

    var Job = dbObject.model("jobs", JobsSchema);
    var JE = dbObject.model("journalEntry", journalEntrySchema);
    var count = 0;
    Invoice.find({}, function (err, result) {
        if (err){
            return console.log(err);
        }

        result.forEach(function (inv) {
            var products = inv.products;
            var invId = inv._id;

            products.forEach(function (prod) {
                var job = prod.jobs;

                Job.find({_id: job, invoice: null}, function (err, result) {
                    if (err){
                        return console.log(err);
                    }
                    Job.findByIdAndUpdate(job, {$set: {invoice: invId}}, function (err, result) {
                        if (err){
                            return console.log(err);
                        }

                        console.log('success');
                    });
                });
            });
        });
    });
});