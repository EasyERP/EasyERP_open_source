/**
 * Created by lilya on 01/12/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');
var QuotationSchema = mongoose.Schemas['Quotation'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var JobsSchema = mongoose.Schemas['jobs'];
var objectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../../constants/mainConstants');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});


var Quotation = dbObject.model("Quotation", QuotationSchema);
var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
var Jobs = dbObject.model("jobs", JobsSchema);
var count = 0;

var query = Jobs.find().lean();

query.exec(function(err, jobs){
    if (err){
        console.log(err);
    }

    async.each(jobs, function(job, callBack){
        var jobId = job._id;

        var parallelTasks = [findQuot, findInv];

        function findQuot(cb){
            Quotation.find({"products.jobs": jobId}, {name: 1}, function(err, quot){
              if (err){
                  return cb(err);
              }

                cb(null, quot ? quot[0] : null);
            })
        }

        function findInv(cb){
            Invoice.find({"products.jobs": jobId}, {name: 1}, function(err, inv){
                if (err){
                    return cb(err);
                }

                cb(null, inv ? inv[0] : null);
            })
        }

        async.parallel(parallelTasks, function(err, result){
            var quot = result[0];
            var inv = result[1];

            var quotObj = {
                _id: quot ? quot._id : null,
                name: quot ? quot.name : ""
            };

            var invObj = {
                _id: inv ? inv._id : null,
                name: inv ? inv.name : ""
            };

            Jobs.findByIdAndUpdate(jobId, {$set: {invoice: invObj, quotation: quotObj}}, function(err, result){
                console.log(count++);
                callBack();
            })

        });
    }, function(){
        console.log('Success');
    });
});
