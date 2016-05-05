var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

require('../../models/index.js');

var Quotation = mongoose.Schemas.Quotation;
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
 var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var counter = 0;

    var Quotation = dbObject.model("Quotation", Quotation);

    Quotation.find({}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (quotation, cb) {
            var paymentInfo = quotation.paymentInfo;
            var products = quotation.products;
            var i;

            paymentInfo.taxes *= 100;
            paymentInfo.unTaxed *= 100;
            paymentInfo.total *= 100;

            for (i = 0; i < products.length; i++) {
                products[i].taxes *= 100;
                products[i].unitPrice *= 100;
                products[i].subTotal *= 100;
            }

            Quotation.findByIdAndUpdate(quotation._id, {$set: {products: products, paymentInfo: paymentInfo}}, function (err, result) {
                if (err) {
                    return cb(err);
                }
                console.log(counter++);
                cb();
            });

        });
    });
});




