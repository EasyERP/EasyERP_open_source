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
    console.log("Connection to production is success");

    var jobsSchema = mongoose.Schema({
        name     : {type: String, default: ''},
        workflow : {
            _id : {type: ObjectId, ref: 'workflows', default: null},
            name: String
        },
        type     : {type: String, enum: ["Not Quoted", 'Quoted', "Ordered", "Invoiced", "Paid"], default: 'Not Quoted'},
        wTracks  : [{type: ObjectId, ref: 'wTrack', default: null}],
        project  : {
            _id           : {type: ObjectId, ref: 'Project', default: null},
            name          : String,
            projectManager: JSON
        },
        budget   : {
            _id        : false,
            projectTeam: {type: Array, default: []},
            budget     : {type: Array, default: []},//weetrackInfo
            budgetTotal: {type: Object, default: {}}
        },
        quotation: {
            _id   : {type: ObjectId, ref: 'Quotation', default: null},
            name  : String,
            status: {type: String, default: ''},
            amount: Number
        },
        invoice  : {
            _id   : {type: ObjectId, ref: 'Invoice', default: null},
            name  : String,
            amount: Number
        },
        payments : [{type: ObjectId, ref: 'Payment', default: null}]

    }, {collection: 'jobs'});

    mongoose.model('jobsOld', jobsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['jobsOld'] = jobsSchema;

    var JobsSchema = mongoose.Schemas['jobs'];
    var JobsSchemaOld = mongoose.Schemas['jobsOld'];

    var Job = dbObject.model("jobs", JobsSchema);
    var JobOld = dbObject.model("jobsOld", JobsSchemaOld);
    var jobId;
    var count = 0;

    var query = JobOld.find().lean();

    query.exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (job, cb) {
            var updateObj = {};
            var jobId = job._id;

            var projectId = job.project ? job.project._id : null;

            updateObj.quotation = job.quotation._id;
            updateObj.invoice = job.invoice._id;
            updateObj.project = projectId;
            updateObj.workflow = job.workflow._id;

            Job.update({_id: jobId}, {$set: updateObj}, {new: true}, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                return console.log(count++);
            });

            cb();
        }, function () {
            console.log('success');
        });

        return console.log('success');
    })
});