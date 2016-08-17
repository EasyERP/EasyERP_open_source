/**
 * Created by lilya on 24/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');

var WorkflowsSchema = mongoose.Schemas['workflows'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Workflows = dbObject.model("workflows", WorkflowsSchema);

var query = Workflows.find() .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

        async.each(_res, function (workflow, callback) {
            var objectToSave = {};

            if ((workflow.wName === "order") && ((workflow.status === "In Progress") || (workflow.status === "Cancelled"))){
                objectToSave.visible = false;
            } else {
                objectToSave.visible = true;
            }

            Workflows.update({_id: workflow._id}, objectToSave, callback);
        }, function (err) {
            if (err) {
                return console.dir(err);
            }

            return console.dir('Good');
        })
});