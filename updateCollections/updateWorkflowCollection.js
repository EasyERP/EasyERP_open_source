/**
 * Created by lilya on 24/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');

var workflowSchema = mongoose.Schema({
    wId: String,
    wName: String,
    status: String,
    name: String,
    color: {type: String, default: "#2C3E50"},
    sequence: Number
}, {collection: 'workflows'});

mongoose.model('workflowsOld', workflowSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['workflowsOld'] = workflowSchema;

var WorkflowsSchema = mongoose.Schemas['workflows'];
var WorkflowsSchemaOld = mongoose.Schemas['workflowsOld'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Workflows = dbObject.model("workflows", WorkflowsSchema);
var WorkflowsOld = dbObject.model("workflowsNew", WorkflowsSchemaOld);

var query = WorkflowsOld.find() .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

        async.each(_res, function (workflow, callback) {
            var objectToSave = {};

            if ((workflow.wId === "Sales Order") && ((workflow.status === "In Progress") || (workflow.status === "Cancelled"))){
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