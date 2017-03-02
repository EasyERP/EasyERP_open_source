var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var PaymentSchema = mongoose.Schemas.wTrackPayOut;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('../../config/environment/' + process.env.NODE_ENV);

var oxr = require('open-exchange-rates');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'CRM');
// var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production'/*, 28017, connectOptions*/);
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Payment = dbObject.model("Payment", PaymentSchema);

    Payment.find({}).populate('paymentMethod').exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        result.forEach(function (payment) {
            payment = payment.toJSON();
            var id = payment._id;
            var paymentMethod = payment.paymentMethod || {};

            Payment.update({_id: id}, {$set: {bankAccount: paymentMethod.chartAccount || null}}, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                console.log('ok');
            });

        });

        console.log('good');
    });

});