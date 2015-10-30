/**
 * Created by liliya on 29.10.15.
 */
var mongoose = require('mongoose');
require('../models/index.js');
var ProjectSchema = mongoose.Schemas['Project'];
var _ = require('../node_modules/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];

var dbObject = mongoose.createConnection('localhost', 'development');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");

    var Project = dbObject.model('Project', ProjectSchema);
    var Job = dbObject.model("jobs", JobsSchema);

    Job.aggregate([
        {
            $group: {
                _id: "$project",
                jobIds: {$addToSet: '$_id'}
            }
        }
    ], function(err, result){
        if (err) {
            return console.log(err);
        }

        result.forEach(function(res){

            var projectId = res._id;
            var jobIds = res.jobIds;

            Project.findByIdAndUpdate(projectId, {$set : {"budget.projectTeam": jobIds}}, function(err, result){
                if (err){
                    console.log(err);
                }
                console.log('ok');
            });

        })
    })
});
