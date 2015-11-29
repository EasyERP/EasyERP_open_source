/**
 * Created by lilya on 29/11/15.
 */
/**
 * Created by lilya on 23/11/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];
var InvoiceSchema = mongoose.Schemas['Invoice'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);
    var Invoice = dbObject.model("Invoice", InvoiceSchema);

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

            Invoice.find({"products.jobs": jobId}, function(err, result){
                if (err) {
                    return console.log(err);
                }

                if (result.length){
                    Job.findByIdAndUpdate(jobId, {$set: {type: "Invoiced"}}, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        return console.log(count++);
                    });
                }
            });

            cb();
        }, function(){
            console.log('success');
        });

        return console.log('success');
    })
});