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

            var invObj = job.workflow._id ? job.workflow._id : null;
            var project = job.project._id ? job.project._id : null;

            Jobs.findByIdAndUpdate(jobId, {$set: {workflow: invObj, project: project}}, function(err, result){
                console.log(count++);
                callBack();
            })

        });
    }, function(){
        console.log('Success');
    });
