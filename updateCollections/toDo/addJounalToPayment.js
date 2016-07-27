var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var PaymentSchema = mongoose.Schemas.wTrackPayOut;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('../../config/' + process.env.NODE_ENV);

var oxr = require('open-exchange-rates');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'alex', 28017, connectOptions);
var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production'/*, 28017, connectOptions*/);
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Payment = dbObject.model("Payment", PaymentSchema);

    var objectWithJournals = {
        '565f2e05ab70d49024242e0c': '577f962bce02eeb33ee901d1',
        '565f2e05ab70d49024242e0d': '577f9653b3d4447f3fafd422',
        '565f2e05ab70d49024242e0a': '577f966bd72226643fc862fb',
        '565f2e05ab70d49024242e09': '577f968f4b90ec163f270f19',
        '565f2e05ab70d49024242e0b': '577f96a885d53fd43eda3086',
        '565f2e05ab70d49024242e08': '577f96cbfe0b3b983ea04614',
        '565f2e05ab70d49024242e0e': '577f96f8d72226643fc862fc',
        '565f2e05ab70d49024242e10': '577f97104b90ec163f270f1a',
        '576cf2edd742b37b20468e4e': '577f9850fe0b3b983ea04615',
        '577f97a15dc67c373fced536': '577f9864d72226643fc862fd',
        '565f2e05ab70d49024242e0f': '56f243d9574610102546a33a'
    };

    Payment.find({}).exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        result.forEach(function (payment) {
            payment = payment.toJSON();
            var id = payment._id;
            var paymentMethod = payment.paymentMethod;
            var journal;

            if (paymentMethod){
                journal = objectWithJournals[paymentMethod.toString()];

                Payment.findByIdAndUpdate(id, {$set: {journal: journal}}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }


        });

        console.log('good');
    });

});