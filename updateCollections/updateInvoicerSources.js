/**
 * Created by lilya on 24/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');
var QuotationSchema = mongoose.Schemas['Quotation'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var objectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../constants/mainConstants');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});


var Quotation = dbObject.model("Quotation", QuotationSchema);
var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);

var query = Quotation.find({isOrder: true}).lean();

query.exec(function(err, orders){
    if (err){
        console.log(err);
    }

    async.each(orders, function(orderEl, cb){
        var products = orderEl.products;
        var orderId = orderEl._id;

        async.each(products, function(el, callback){
            var jobId = el.jobs;

            Invoice.update({"products.jobs": jobId}, {$set: {sourceDocument: orderId}}, function(err, result){
                callback()
            });
        }, function(){
            cb();
        });
    }, function(){
        console.log('Success');
    });
});
