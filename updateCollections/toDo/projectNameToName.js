var mongoose = require('mongoose');
var ProjectSchema;
var async;
var dbObject;
var Project;
var query;

require('../../models/index.js');

ProjectSchema = mongoose.Schemas.Project;
async = require('async');
dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', function (err) {
    console.error(err);
});
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

Project = dbObject.model('Project', ProjectSchema);

Project.collection.update({}, {$rename: {projectName: 'name'}}, {multi: true}, function (error, res) {
    if (error) {
        return console.dir(error);
    }

    console.log(res);

    Project.collection.update({}, {
        $unset: {
            salesmanager  : '',
            projectmanager: ''
        }
    }, {multi: true}, function (err, updated) {
        if (error) {
            return console.dir(error);
        }

        console.log(updated);
    });
});
