var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var projectMemberSchema = mongoose.Schemas['ProjectMember'];

//var dbObject = mongoose.createConnection('localhost', 'production');

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to db is success");
});

var ProjectMember = dbObject.model("ProjectMember", projectMemberSchema);

var data = {
    startDate: null,
    endDate  : null
};

ProjectMember.update({projectPositionId: "570e9a75785753b3f1d9c86e"}, data, {multi: true}, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Good");

});


