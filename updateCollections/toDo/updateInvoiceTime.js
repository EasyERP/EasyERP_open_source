/**
 * Created by roma on 15.04.16.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');
var moment = require('../../public/js/libs/moment/moment');

var _ = require('../../node_modules/underscore/underscore');
var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var counter = 0;

    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);

    Invoice.find({}, {invoiceDate: 1}, function (err, result) {
        if (err){
           return console.log(err);
        }

        async.each(result, function (inv, cb) {
            var date = inv.invoiceDate;
            var momentDate = moment(date);
            var newDate;

            if (momentDate.date() === 1){
                newDate = moment(momentDate).set({'hour': 4, 'minute': 0, 'second': 0});

                Invoice.findByIdAndUpdate(inv._id, {$set: {invoiceDate: new Date(newDate)}}, function (err, result) {
                    if (err){
                        return cb(err);
                    }
                    console.log(counter++);
                    cb();
                });
            } else {
                cb();
            }
        });
    })

});
