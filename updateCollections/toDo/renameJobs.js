var mongoose = require('mongoose');
var async;
var dbObject;


require('../../models/index.js');

var jobsSchema = mongoose.Schemas.jobs;
async = require('async');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
dbObject = mongoose.createConnection('45.32.47.248', 'CRM', 27017/*, connectOptions*/);
dbObject.on('error', function (err) {
    console.error(err);
});
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

var jobs = dbObject.model('jobs', jobsSchema);

jobs.find({}).populate('project', 'name').exec(function (err, result) {

    result.forEach(function (job, index) {
        var newName = job.project.name + '_' + index;

        jobs.findByIdAndUpdate(job._id, {$set: {name: newName}}, function () {

        });
    });

    console.log('good');

});


