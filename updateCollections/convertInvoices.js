/**
 * Created by liliya on 29.10.15.
 */
var mongoose = require('mongoose');
require('../models/index.js');
var Invoice = mongoose.Schemas['wTrackInvoice'];
var InvoiceOld = mongoose.Schemas['wTrackInvoiceOld'];
var wTrackSchema = mongoose.Schemas['wTrack'];
var _ = require('../node_modules/underscore');
var CONSTANTS = require('../constants/mainConstants');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];
var objectId = mongoose.Types.ObjectId;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");

    var Invoice = dbObject.model('wTrackInvoice', Invoice);
    var InvoiceOld = dbObject.model('wTrackInvoiceOld', InvoiceOld);
    var Job = dbObject.model("jobs", JobsSchema);

    var query = InvoiceOld.find({invoiceType: "wTrack", forSales: true}).lean();

    query.populate('products.product');

    query.exec(function(err, result){
        if (err){
          return   console.log(err);
        }

        async.each(result, function(element, cb){
            var products = element.products;
            var producItem = products[0];

            var prod = producItem.product;

            var productService = CONSTANTS.PRODUCRSERVICE;

            var jobId = prod ? prod.jobs._id : null;
            var unitPrice = element.paymentInfo.unTaxed;
            var taxes = element.paymentInfo.taxes;
            var balance = unitPrice - element.paymentInfo.balance;

            console.log(productService);

            var newProduct = {
                unitPrice: unitPrice,
                product      : objectId(productService),
                jobs: jobId,
                subTotal: balance,
                taxes: taxes
            };

            Invoice.update({_id: element._id}, {$set: {products: [newProduct]}}, function(err, result){
                if (err){
                    return   console.log(err);
                }
                console.log('ok');
                cb();
            });
        })
    }, function(cb){
        console.log('success');
    });

});