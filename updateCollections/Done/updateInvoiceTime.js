/**
 * Created by roma on 15.04.16.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');
var moment = require('../../public/js/libs/moment/moment');
var wTrackSchema = mongoose.Schemas.wTrack;
var _ = require('../../node_modules/underscore/underscore');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var journalEntrySchema = mongoose.Schemas.journalEntry;
    var JE = dbObject.model("journalEntry", journalEntrySchema);
    var counter = 0;
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var Employee = dbObject.model("Employees", EmployeeSchema);
    var wTrack = dbObject.model("wTrack", wTrackSchema);


    // Employee.find({_id: "55b92ad221e4b7c40f000034"}, {fire: 1, hire: 1}, function (err, result) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     var firedEmpl = [];
    //     var wTRackArray = [];
    //     async.each(result, function (emp, cb) {
    //         console.log(emp.fire.length);
    //
    //         firedEmpl.push(emp._id);
    //
    //         JE.remove({"sourceDocument._id": emp._id, date: {$gte: new Date("8 Aug 2014"), $lte: new Date("29 Dec 2014")}}, function (err, result) {
    //             wTrack.find({employee: {$in: firedEmpl}}, function (err, result) {
    //
    //                 result.forEach(function (wtr) {
    //                     wTRackArray.push(wtr._id);
    //                 });
    //
    //                 JE.remove({"sourceDocument._id": {$in: wTRackArray}, "sourceDocument.model": 'wTrack', date: {$gte: new Date("8 Aug 2014"), $lte: new Date("29 Dec 2014")}}, function (err, result) {
    //                     cb();
    //                 });
    //
    //             });
    //         })
    //     }, function (err, result) {
    //         console.log('good');
    //     });
    //
    // });
    Employee.find({isEmployee: false}, {fire: 1, hire: 1}, function (err, result) {
        if (err) {
            return console.log(err);
        }
        var firedEmpl = [];
        var wTRackArray = [];
        async.each(result, function (emp, cb) {
            console.log(emp.fire.length);

            firedEmpl.push(emp._id);

            JE.remove({"sourceDocument._id": emp._id, date: {$lte: new Date(emp.hire[0])}}, function (err, result) {
                wTrack.find({employee: {$in: firedEmpl}}, function (err, result) {

                    result.forEach(function (wtr) {
                        wTRackArray.push(wtr._id);
                    });

                    JE.remove({"sourceDocument._id": {$in: wTRackArray}, "sourceDocument.model": 'wTrack', date: {$lte: new Date(emp.hire[0])}}, function (err, result) {
                        cb();
                    });

                });
            })
        }, function (err, result) {
            console.log('good');
        });

    });


    // JE.find({}, {date: 1}, function (err, result) {
    //     async.each(result, function (je, cb) {
    //         var date = je.date;
    //         var momentDate = moment(date);
    //         var newDate;
    //
    //         if (momentDate.hours() === 23) {
    //             newDate = moment(momentDate).subtract(3, 'hours');
    //
    //             JE.findByIdAndUpdate(je._id, {$set: {date: new Date(newDate)}}, function (err, result) {
    //                 if (err) {
    //                     return cb(err);
    //                 }
    //                 console.log(counter++);
    //                 cb();
    //             });
    //         } else {
    //             cb();
    //         }
    //     });
    // });

    /*var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var counter = 0;

    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);

    Invoice.find({forSales: true}, {invoiceDate: 1, payments: 1}).populate('payments').exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (inv, cb) {
            var payments = inv.payments;

            if (payments && payments.length){
                var maxDate = payments[0].date;

                payments.forEach(function (paym) {
                    if (paym.date > maxDate) {
                        maxDate = paym.date;
                    }
                });

                Invoice.findByIdAndUpdate(inv._id, {$set: {paymentDate: maxDate}}, function (err, result) {
                    if (err) {
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
*/
});
