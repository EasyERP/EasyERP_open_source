/**
 * Created by lilya on 02/12/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var QuotationSchema = mongoose.Schemas['Quotation'];
var JobsSchema = mongoose.Schemas['jobs'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Quotation = dbObject.model("Quotation", QuotationSchema);
var JobsModel = dbObject.model("jobs", JobsSchema);

var query = Quotation.find({forSales: true}).lean();

query.populate('products.jobs');

query.exec(function (error, _res) {

    async.each(_res, function(quot, callback){
        var products = quot.products;
        var newProducts = [];
        var quotId = quot._id;

        if (products.length > 1){
            async.each(products, function(prod, cb){
                var newProduct = prod;
                var job = prod.jobs;

                JobsModel.findById(job, function(err, result){
                    if (err){
                        console.log(err);
                    }

                    var totalSum = result && result.budget ? result.budget.budgetTotal.revenueSum: 0;

                    newProduct.taxes = 0;
                    newProduct.unitPrice = totalSum;
                    newProduct.subTotal = totalSum;

                    newProducts.push(newProduct);
                    cb();
                })
            }, function(){
                Quotation.findByIdAndUpdate(quotId, {$set: {products: newProducts}}, {new: true}, function(err, result){

                });

                callback()
            });
        } else {
            var newProduct = products[0];
            newProduct.taxes = 0;
            newProduct.unitPrice = quot.paymentInfo.total;
            newProduct.subTotal = quot.paymentInfo.total;
            newProducts.push(newProduct);
            Quotation.findByIdAndUpdate(quotId, {$set: {products: newProducts}}, {new: true}, function(err, result) {
            });

            callback();
        }



    }, function(){
        console.log('updated')
    })

});