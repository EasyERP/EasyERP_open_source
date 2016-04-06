
/*
* Update DB jobs with type: "Not Quoted" and revenue, profit great 0
* */

var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var JobsSchema = mongoose.Schemas['jobs'];

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w: 1,
    j: true
};

//var dbObject = mongoose.createConnection('144.76.56.111:28017/lilyadb', connectOptions);

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {

    var arrayJobs;
    var jobBudget;
    var i;
    var j;

    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);

    var jobs = Job.find({type: "Not Quoted", "budget.budgetTotal.revenueSum": {$gt: 0}},
        {_id: 1, budget: 1, wTracks: 1},
        function (err, result) {
            arrayJobs = result;

            for (i = 0; i < arrayJobs.length; i++) {
                jobBudget = arrayJobs[i].budget;

                for (j = 0; j < jobBudget.budget.length; j++) {
                    jobBudget.budget[j].revenue = 0;
                    jobBudget.budget[j].profit = 0;
                }

                jobBudget.budgetTotal.revenueSum = 0;
                jobBudget.budgetTotal.profitSum = 0;

                Job.update({_id: arrayJobs[i]._id}, {$set: {"budget": jobBudget}}, function(err, result){
                    if(!err){
                        console.log(result);
                    } else {
                        console.log(err);
                    }

                });
            }
        });
});