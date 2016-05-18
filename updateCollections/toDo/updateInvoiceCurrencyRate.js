var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

require('../../models/index.js');

var Invoice = mongoose.Schemas.wTrackInvoice;
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'dendb', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var counter = 0;

    var Invoice = dbObject.model("wTrackInvoice", Invoice);

    Invoice.find({}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (invoice, cb) {
            var paymentInfo = invoice.paymentInfo;
            var products = invoice.products;
            var i;
            var flag = false;

            var sumProductTaxes = 0;
            var sumProductUnTaxed = 0;
            var sumProductTotal = 0;

            for (i = 0; i < products.length; i++) {
                sumProductTaxes += products[i].taxes;
                sumProductUnTaxed += products[i].unitPrice;
                sumProductTotal += products[i].subTotal;
            }

            sumProductTaxes *= 100;
            sumProductUnTaxed *= 100;
            sumProductTotal *= 100;

            if (sumProductTaxes === paymentInfo.taxes) {
                for (i = 0; i < products.length; i++) {
                    products[i].taxes *= 100;
                }
                flag = true;
            }

            if (sumProductUnTaxed === paymentInfo.unTaxed) {
                for (i = 0; i < products.length; i++) {
                    products[i].unitPrice *= 100;
                }
                flag = true;
            }

            if (sumProductTotal === paymentInfo.total) {
                for (i = 0; i < products.length; i++) {
                    products[i].subTotal *= 100;
                }
                flag = true;
            }

            if (flag) {
                Invoice.findByIdAndUpdate(invoice._id, {
                    $set: {
                        products: products
                    }
                }, function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    cb();
                });
            }
        }, function (err, cb) {
            if (err) {
                return cb(err);
            }
            console.log('success');
        });
    });
});




