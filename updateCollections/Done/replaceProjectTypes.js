var mongoose = require('mongoose');
require('../../models/index.js');

var projectTypeSchema = mongoose.Schemas['projectType'];

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var ProjectTypes = dbObject.model("projectType", projectTypeSchema);

var newProjectTypes = [
    {
        _id : 'fixed',
        name: 'fixed'
    }, {
        _id : 'time & material',
        name: 'time & material'
    }, {
        _id : 'mixed',
        name: 'mixed'
    }
];

ProjectTypes.collection.drop(function(err, result) {
    if (err) {
        return console.error(err);
    }

    console.log(result);

    ProjectTypes.collection.insert(newProjectTypes, function (err, success) {
        if (err) {
            return console.error(err);
        }

        console.log(success);
    });
});


