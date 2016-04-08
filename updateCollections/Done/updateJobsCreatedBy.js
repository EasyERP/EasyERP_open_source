/**
 * Created by liliy on 08.02.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var async = require('async');
var JobsSchema = mongoose.Schemas['jobs'];
var wTrackSchema = mongoose.Schemas['wTrack'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);
    var wTracks = dbObject.model("Invoice", wTrackSchema);

    var query = Job.find().populate('wTracks').lean();
    var count = 0;

    query.exec(function (err, result) {

        async.each(result, function (model, cb) {
            var defaultObj = {
                date: new Date(),
                user: '52203e707d4dba8813000003'
            };
            var length = model.wTracks.length;
            var createdBy = model.wTracks[0] ? model.wTracks[0].createdBy : defaultObj;
            var editedBy = model.wTracks[length - 1] ? model.wTracks[length - 1].editedBy : defaultObj;

            if (!editedBy.date){
                editedBy.date = new Date();
            }

            Job.update({_id: model._id}, {$set: {createdBy: createdBy, editedBy: editedBy}}, cb);

        }, function () {
            console.log(count++);
        });

    });


});