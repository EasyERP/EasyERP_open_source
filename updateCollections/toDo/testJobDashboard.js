/**
 * Created by lilya on 08/12/15.
 */
/**
 * Created by lilya on 23/11/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];
var ObjectId = mongoose.Schema.Types.ObjectId;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {

    var JobsSchema = mongoose.Schemas['jobs'];

    var Job = dbObject.model("jobs", JobsSchema);

    Job.aggregate([{
        $lookup: {
            from        : "Project",
            localField  : "project._id",
            foreignField: "_id", as: "projects"
        }
    }, {
        $lookup: {
            from        : "Invoice",
            localField  : "invoice._id",
            foreignField: "_id", as: "_invoices"
        }
    }], function(err, jobs){
        "use strict";
        console.dir(jobs);
    });

});