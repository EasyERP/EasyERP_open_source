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

//var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production'/*, 28017, connectOptions*/);
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Payment = dbObject.model("Payment", PaymentSchema);

    Payment.update({paymentMethod: {$in: ["565f2e05ab70d49024242e07", "575fb4c97330dff16a34038d", "555cc981532aebbc4a8baf36"]}}, {$set: {paymentMethod: "565f2e05ab70d49024242e0f"}}, {multi: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    Payment.update({paymentMethod: '565f2e05ab70d49024242e08'}, {$set: {paymentMethod: "565f2e05ab70d49024242e0f"}}, {multi: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    Payment.update({paymentMethod: '565f2e05ab70d49024242e0a'}, {$set: {paymentMethod: "565f2e05ab70d49024242e0c"}}, {multi: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    Payment.update({paymentMethod: '565f2e05ab70d49024242e0a'}, {$set: {paymentMethod: "565f2e05ab70d49024242e0c"}}, {multi: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

});
