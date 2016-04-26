/**
 * Created by liliy on 26.04.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var CONSTANTS = require('../../constants/mainConstants');
var moment = require('../../public/js/libs/moment/moment');
var async = require('async');
var JobsSchema = mongoose.Schemas.jobs;
var journalEntrySchema = mongoose.Schemas.journalEntry;
var journalSchema = mongoose.Schemas.journal;
var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
var PaymentSchema = mongoose.Schemas.wTrackPayOut;
var wTrackSchema = mongoose.Schemas.wTrack;
var ObjectId = mongoose.Types.ObjectId;


var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w: 1,
    j: true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
    var Payment = dbObject.model("Payment", PaymentSchema);
    var wTrackModel = dbObject.model("wTrack", wTrackSchema);

    var Job = dbObject.model("jobs", JobsSchema);
    var JE = dbObject.model("journalEntry", journalEntrySchema);
    var count = 0;


    JE.find({
        debit: {$gt: 0},
        'sourceDocument.model': 'wTrack',
        account: "565eb53a6aa50532e5df0bda"
    }, {sourceDocument: 1}, function (err, result) {
        if (err) {
            return console.log(err);
        }
        var wTracks = [];
        var newwTracks = [];
        result.forEach(function (je) {
            wTracks.push(je.sourceDocument._id);
        });


        wTrackModel.aggregate([{
            $match: {
                _id: {$in: wTracks}
            }
        }, {
            $group: {
                _id: '$jobs'
            }
        }], function (err, result) {
            var jobsArray = _.pluck(result, '_id');
            var jobsFinished = [];
            JE.aggregate([{
                $match: {
                    "sourceDocument._id": {$in: jobsArray},
                    credit: {$gt: 0},
                    journal: ObjectId('56f2a96f58dfeeac4be1582a')
                }
            }, {$group: {
                _id: '$sourceDocument._id'
            }}], function (err, result) {
                var newResult = _.pluck(result, '_id');
                newResult.forEach(function (je) {
                    jobsFinished.push(je.toString());
                });
                jobsArray.forEach(function (je) {
                    newwTracks.push(je.toString());
                });

                var resultArray = _.difference(newwTracks, jobsFinished);
                var newAr = [];
                resultArray.forEach(function (je) {
                    newAr.push(ObjectId(je));
                });
                Job.aggregate([{
                    $match: {
                        "_id": {$in: newAr}
                    }
                }, {
                    $unwind: '$wTracks'
                }, {
                    $group: {
                        _id: null,
                        wTracks: {$push:'$wTracks'}
                    }
                }], function (err, resultjob) {
                    if (err){
                        return console.log(err);
                    }
                    JE.aggregate([{
                        $match: {
                            "sourceDocument._id": {$in: resultjob[0].wTracks},
                            credit: {$gt: 0}
                        }
                    }, {
                        $group: {
                        _id: null,
                        sum: {$sum: '$credit'}
                    }}], function (err, result) {
                        console.dir(result)
                    });
                });

            });
        });
    });


    // Invoice.find({}).populate('project').exec(function (err, result) {
    //     if (err){
    //         return console.log(err);
    //     }
    //
    //     result.forEach(function (inv) {
    //         var products = inv.products;
    //         var invId = inv._id;
    //
    //         products.forEach(function (prod) {
    //             var job = prod.jobs;
    //
    //             Job.find({_id: job}, function (err, result) {
    //                 if (err){
    //                     return console.log(err);
    //                 }
    //                 if (!result.length){
    //                    var payments = inv.payments;
    //
    //                     Payment.remove({_id: {$in: payments}}, function(err, result){
    //
    //                     });
    //
    //                     Invoice.remove({_id: invId}, function (){
    //
    //                     });
    //                 }
    //             });
    //         });
    //     });
    // });

    // var count = 0;
    // Job.find({invoice: {$ne: null}}).populate('quotation').exec(function (err, result) {
    //     if (err){
    //         return console.log(err);
    //     }
    //     var type = 'Quoted';
    //
    //     result.forEach(function (job) {
    //
    //         if (job.quotation && job.quotation._id && job.quotation.isOrder ){
    //             type = 'Ordered';
    //         } else if (job.quotation && job.quotation._id) {
    //             type = 'Quoted';
    //         } else {
    //             type = 'Not Quoted';
    //         }
    //
    //         Invoice.findById(job.invoice, function (err, result) {
    //             if (result._type === 'Proforma'){
    //                 console.log(count++);
    //
    //                 Job.findByIdAndUpdate(job._id, {$set: {invoice: null, type: type, workflow: '56337c705d49d8d6537832eb'}}, function(){
    //
    //                 })
    //             }
    //         });
    //     });
    // });
});