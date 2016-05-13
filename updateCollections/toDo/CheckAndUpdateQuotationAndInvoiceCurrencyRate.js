var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
//var currencyHalper = require('../helpers/currency');
var currencyHalper = require('../../helpers/currency.js');

require('../../models/index.js');

var Quotation = mongoose.Schemas.Quotation;
var Currency = mongoose.Schemas.currency;
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'dendb', 28017, connectOptions);
// var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
    var counter = 0;

    var Quotation = dbObject.model('Quotation', Quotation);
    var Currency = dbObject.model('currency', Currency);

    Currency.find({}, function (err, res) {
        if (err) {
            return console.log(err);
        }

        Quotation.find({
            'currency.rate': {$exists: false},
            'currency._id' : {$ne: '565eab29aeb95fa9c0f9df2d'}
        }, function (err, result) {

            if (err) {
                return console.log(err);
            }

            async.each(result, function (quotation, cb) {

                currencyHalper(quotation.orderDate, function (err, oxr) {
                    var rates;
                    var currency = quotation.currency;
                    var modelCur = _.find(res, function(model){
                        return model._id.toString() === currency._id.toString();
                    });

                    if (err) {
                        return cb(err);
                    }

                    oxr = oxr || {};
                    rates = oxr.rates;
                    var currencyName = modelCur.get('name');

                    if (rates && rates[currencyName]) {
                        currency.rate = rates[currencyName];
                    } else {
                        console.log('oxr.rates is not correct');
                        return cb(err);
                    }

                    console.log(quotation.orderDate);
                    console.log(currency.rate);
                    console.log();

/*                    Quotation.findByIdAndUpdate(quotation._id, {
                        $set: {
                            currency   : currency
                        }
                    }, function (err, result) {
                        if (err) {
                            return cb(err);
                        }
                        console.log(counter++);
                        cb();
                    });*/
                });
            }, function (err, cb) {
                if (err) {
                    return cb(err);
                }
                console.log('update currency rate in Quotation was done');
            });
        });
    });
});




