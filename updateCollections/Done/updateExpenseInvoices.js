/**
 * Created by liliya on 24.05.16.
 */
/**
 * Created by lilya on 07/12/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var InvoiceSchema = mongoose.Schemas['expensesInvoice'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Invoice = dbObject.model("expensesInvoice", InvoiceSchema);

var query = Invoice.find({_type: "expensesInvoice"}).lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (invoice, callback) {
        var products = invoice.products;
        var newProducts = [];

        products.forEach(function(product){
            product.subTotal = product.subTotal / 100;
            product.unitPrice = product.unitPrice / 100;
            newProducts.push(product);
        });
        Invoice.update({_id: invoice._id}, {$set: {products: newProducts}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    })
});