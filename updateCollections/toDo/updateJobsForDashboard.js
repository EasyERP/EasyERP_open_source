/**
 * Created by lilya on 08/12/15.
 */
/**
 * Created by lilya on 23/11/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore');
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
        project  : {type: ObjectId, ref: 'Project', default: null},
        budget   : {
            _id          : false,
            projectTeam  : {type: Array, default: []},
            projectValues: {type: Array, default: []},
            budget       : {type: Array, default: []},
            budgetTotal  : {type: Object, default: {}}
        },
        quotation: {
            _id   : {type: ObjectId, ref: 'Quotation', default: null},
            name  : String,
            status: {type: String, default: ''}
        },
        invoice  : {
            _id : {type: ObjectId, ref: 'Invoice', default: null},
            name: String
        }

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

    query
        .populate('project')
        .populate('invoice._id')
        .populate('quotation._id');

    query.exec(function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (job, cb) {
            var updateObj = {};
            var jobId = job._id;

            var projectManager = job.project ?  job.project.projectmanager : {_id: null, name: ''};
            var quotSum = job.quotation._id ? job.quotation._id.paymentInfo.total : 0;
            var invSum = job.invoice._id ? job.invoice._id.paymentInfo.total : 0;
            var projectName = job.project ? job.project.projectName : '';
            var projectId = job.project ? job.project._id : null;
            var payments = job.invoice._id ? job.invoice._id.payments : [];

            updateObj.quotation = job.quotation;
            updateObj.invoice = job.invoice;
            updateObj.project = {};

            updateObj.project.projectManager = projectManager;
            updateObj.quotation.amount = quotSum;
            updateObj.invoice.amount = invSum;
            updateObj.project.name = projectName;
            updateObj.project._id = projectId;
            updateObj.payments = payments;

            Job.update({_id: jobId}, {$set: updateObj}, {new : true}, function (err, result) {
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