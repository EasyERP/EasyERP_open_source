require('../../models/index.js');

var mongoose = require('mongoose');
var workflowsSchema = mongoose.Schemas.workflow;
var dbName = 'lilyadb';
var dbObject;
var models;
var dbsObject = {};

dbObject = mongoose.createConnection('144.76.56.111', dbName, 28017);
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);

var Workflow = dbObject.model('workflows', workflowsSchema);

Workflow.update({$or: [{wId: 'Leads', name: 'Don\'t Contact'}, {wId: 'Leads', name: 'No Answer'}]}, {$inc: {sequence: 1}}, {new: true, multi: true}, function (err, success) {
    if (err) {
        return console.log(err);
    }

    console.log(success);

    console.log('success! data is updated');
});