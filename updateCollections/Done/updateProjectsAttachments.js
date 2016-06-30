/**
 * Created by liliya on 24.05.16.
 */
/**
 * Created by lilya on 07/12/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var projectSchema = mongoose.Schemas['Project'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Project = dbObject.model('Project', projectSchema);

var query = Project.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (project, callback) {
        var attachments = project.attachments;
        var newAttachments = [];

        attachments.forEach(function(_attach){
            var url = 'uploads/projects/' + project._id + '/' + _attach.name;

            url = encodeURIComponent(url);

            _attach.shortPas = url;
            newAttachments.push(_attach);
        });
        Project.update({_id: project._id}, {$set: {attachments: newAttachments}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    });
});