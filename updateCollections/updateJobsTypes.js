/**
 * Created by lilya on 23/11/15.
 */
var mongoose = require('mongoose');
require('../models/index.js');
var _ = require('../node_modules/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);
    var updateObj = {};
    var jobId;
    var count = 0;

    var query = Job.find().lean();

    query.exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

            async.each(result, function (job, cb) {

                jobId = job._id;

                if (job.type === "Empty"){
                    updateObj.type = "notQuoted"
                } else if (job.type === "Quotation"){
                    updateObj.type = "Quoted"
                } else if (job.type === "Order"){
                    updateObj.type = "Ordered"
                } else if (job.type === "Invoice"){
                    updateObj.type = "Invoiced"
                } else if (job.type === "Payment"){
                    updateObj.type = "Payed"
                }

                Job.findByIdAndUpdate(jobId, {$set: updateObj}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    return console.log(count++);
                });

                cb();
            }, function(){
                console.log('success');
            });

            return console.log('success');
    })
});