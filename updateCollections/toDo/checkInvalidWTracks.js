/**
 * Created by liliy on 11.04.2016.
 */
require('../../models/index.js');
var async = require('async');

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var currencyHalper = require('../../helpers/currency');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var wTrack = dbObject.model("wTrack", Schema.wTrack);

//wTrack.aggregate([{
//    $lookup: {
//        from        : 'jobs',
//        localField  : 'jobs',
//        foreignField: '_id',
//        as          : 'jobs'
//    }
//}, {
//    $project: {
//        jobs   : {$arrayElemAt: ['$jobs', 0]},
//        _id    : 1,
//        project: 1
//    }
//}, {
//    $match: {
//        project: {$ne: ["$jobs.project", '$project']}
//    }
//}], function (err, result) {
//    if (err) {
//        return console.log(err);
//    }
//
//    console.log(result.length);
//});
var count = 0;
wTrack.find({}).populate('jobs').populate('project').exec(function (err, result) {
    result.forEach(function (el) {
        if (el.project._id.toString() !== el.jobs.project.toString()){
            console.log(el.project._id);
            console.log(el.project.projectName);
        }
    });
});
