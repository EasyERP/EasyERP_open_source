/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var workflowsSchema = mongoose.Schemas.workflows;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

//var dbObject = mongoose.createConnection('localhost', 'production');

var Module = dbObject.model("workflows", workflowsSchema);

Module.update({wId: 'Deals', name : {$in : ['Won', 'Lost']}}, {visible: false}, {multi : true},  function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Good');
});
