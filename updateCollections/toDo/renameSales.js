/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ModuleSchema = mongoose.Schemas.modules;
var WorkflowSchema = mongoose.Schemas.workflow;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);
var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production');

var Module = dbObject.model("modules", ModuleSchema);
var Workflow = dbObject.model("workflows", WorkflowSchema);

var parallelTasks = [function (cb) {
    Module.update({href: 'Deals'}, {href: "Opportunities", mname: "Opportunities"}, cb);
}, function (cb) {
    Module.update({href: 'Sales'}, {mname: "CRM"}, cb);
},function (cb) {
    Workflow.update({wId: 'Deals'}, {wId: "Opportunities"}, {multi : true}, cb);
}];

async.parallel(parallelTasks, function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Good');
});
