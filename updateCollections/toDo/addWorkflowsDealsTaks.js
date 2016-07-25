var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var WorkflowsSchema = mongoose.Schemas['workflows'];
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);
//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Workflows = dbObject.model("workflows", WorkflowsSchema);

var newProjectPositions = [
    {
        "_id"   : ObjectId("5783b351df8b918c31af24a8"),
        "name"  : "Not Started",
        'status': 'New',
        wId     : 'DealTasks',
        wName   : 'Deal Tasks',
        visible : true,
        sequence: 3
    },
    {
        "_id"   : ObjectId("5783b351df8b918c31af24a9"),
        "name"  : "In Progress",
        'status': 'In Progress',
        wId     : 'DealTasks',
        wName   : 'Deal Tasks',
        visible : true,
        sequence: 3
    },
    {
        "_id"   : ObjectId("5783b351df8b918c31af24aa"),
        "name"  : "Waiting",
        'status': 'Pending',
        wId     : 'DealTasks',
        wName   : 'Deal Tasks',
        visible : true,
        sequence: 2
    },
    {
        "_id"   : ObjectId("5783b351df8b918c31af24ab"),
        "name"  : "Completed",
        'status': 'Done',
        wId     : 'DealTasks',
        wName   : 'Deal Tasks',
        visible : true,
        sequence: 1
    },
    {
        "_id"   : ObjectId("5783b351df8b918c31af24ac"),
        "name"  : "Deferred",
        'status': 'Cancelled',
        wId     : 'DealTasks',
        wName   : 'Deal Tasks',
        visible : true,
        sequence: 0
    }
];

Workflows.collection.insert(newProjectPositions, function (err, success) {
    if (err) {
        return console.error(err);
    }

    console.log(success);
});
