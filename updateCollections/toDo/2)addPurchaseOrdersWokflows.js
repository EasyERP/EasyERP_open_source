var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var workflowsSchema = mongoose.Schemas.workflow;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'CRM');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Workflow = dbObject.model("workflows", workflowsSchema);

var newWorkflows = [
    {
        "_id"     : ObjectId("5555bf276a3f01acae0b5560"),
        "name"    : "Placed with supplier",
        "sequence": 3,
        "status"  : "New",
        "wId"     : "Purchase Order",
        "visible" : true
    },
    {
        "_id"     : ObjectId("5555bf276a3f01acae0b5561"),
        "sequence": 4,
        "status"  : "Pending",
        "name"    : "Pending PO",
        "visible" : true,
        "wId"     : "Purchase Order"
    },
    {
        "_id"     : ObjectId("5555bf276a3f01acae0b5562"),
        "sequence": 2,
        "status"  : "In Progress",
        "name"    : "Products received",
        "visible" : true,
        "wId"     : "Purchase Order"
    },
    {
        "_id"     : ObjectId("5559f344dadd53e09d753ead"),
        "sequence": 0,
        "status"  : "Cancelled",
        "name"    : "Cancelled",
        "visible" : true,
        "wId"     : "Purchase Order"
    }, {
        "_id"     : ObjectId("56599347bfd103f108eb4caa"),
        "sequence": 1,
        "status"  : "Done",
        "name"    : "Invoiced received",
        "wId"     : "Purchase Order",
        "visible" : true
    }
];

Workflow.remove({wId : 'Purchase Order'}, function(err){
    if (err){
        return console.log(err);
    }
    Workflow.collection.insert(newWorkflows, function (err, success) {
        if (err) {
            return console.error(err);
        }

        console.log(success);
    });
});


