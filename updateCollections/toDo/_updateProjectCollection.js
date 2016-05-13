var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ProjectSchema = mongoose.Schemas.Project;

var connectOptions = {
    user  : 'easyErp',
    pass  : '1q2w3e!@#',
    w     : 1,
    j     : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

var dbObject = mongoose.createConnection('localhost', 'production');

var project = dbObject.model("Project", ProjectSchema);

var query = project.update({}, {paymentTerms : '55536e52475b7be475f335f6', paymentMethod : '565f2e05ab70d49024242e07'}, {multi : true} , function (err) {
    if (err) {
        return console.dir(err);
    }

    console.dir('Good');
});
