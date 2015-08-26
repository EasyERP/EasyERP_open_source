/**
 * Created by soundstorm on 26.08.15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');

var PaymentSchema = mongoose.Schemas['wTrackPayment'];
var PaymentSchemaOld = mongoose.Schemas['Payment'];

var dbObject = mongoose.createConnection('localhost', 'weTrack');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var Payment = dbObject.model("wTrackPayment", PaymentSchema);
var PaymentOld = dbObject.model("Payment", PaymentSchemaOld);

var query = PaymentOld.find({forSale: false, bonus: true})
    .populate('supplier', 'name')
    .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (payment, callback) {
        var objectToSave = {};

        if (payment) {
            objectToSave = {
                supplier: payment.supplier ? {
                    _id: payment.supplier._id,
                    name: (payment.supplier.name.first + ' ' +  payment.supplier.name.last)
                } : {
                    _id: null,
                    name: ''
                }
            };
        }

        Payment.update({_id: payment._id}, objectToSave, callback);
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});