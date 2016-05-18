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


var Quotation = dbObject.model("Quotation", QuotationSchema);
var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
var count = 0;

var query = Invoice.find({forSales: true}).lean();

query.exec(function(err, invoice){
    if (err){
        console.log(err);
    }

    async.each(invoice, function(orderEl, cb){
        var products = orderEl.products;

        async.each(products, function(el, callback){
            var jobId = el.jobs;

            Quotation.find({"products.jobs": jobId}, function(err, result){
                if (err){
                   return console.log(err);
                }
                var orderId = result.length ? result[0].get('_id') : null;

                Invoice.update({"products.jobs": jobId}, {$set: {sourceDocument: orderId}}, function(err, result){
                    console.log(count++);
                    callback()
                });
            })
        }, function(){
            cb();
        });
    }, function(){
        console.log('Success');
    });
});
