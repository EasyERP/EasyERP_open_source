var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var unlinkedWorkflowId = require('../../constants/mainConstants').DEFAULT_UNLINKED_WORKFLOW_ID;

require('../../models/index.js');

var workflowsSchema = mongoose.Schemas.workflow;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Workflow = dbObject.model("workflows", workflowsSchema);

var newWorkflows = [
    {
        "_id"     : ObjectId(unlinkedWorkflowId),
        "name"    : "Unlinked",
        "sequence": 6,
        "status"  : "UnLinked",
        "wId"     : "Sales Order",
        "visible" : false
    },
    {
        "_id"     : ObjectId("55647b932e4aa3804a765ec5"),
        "name"    : "Draft/ Quotation",
        "sequence": 4,
        "status"  : "New",
        "wId"     : "Sales Order",
        "visible" : true
    },
    {
        "_id"     : ObjectId("57f4bce848c62c5c68690dbb"),
        "sequence": 3,
        "status"  : "New",
        "name"    : "New Order",
        "visible" : true,
        "wId"     : "Sales Order"
    },
    {
        "_id"     : ObjectId("57f4bcfe48c62c5c68690dbc"),
        "sequence": 2,
        "status"  : "In Progress",
        "name"    : "Processing",
        "visible" : true,
        "wId"     : "Sales Order"
    },
    {
        "_id"     : ObjectId("57f4bd1f48c62c5c68690dbe"),
        "sequence": 1,
        "status"  : "Cancelled",
        "name"    : "Cancelled",
        "visible" : true,
        "wId"     : "Sales Order"
    }, {
        "_id"     : ObjectId("55647b962e4aa3804a765ec6"),
        "sequence": 0,
        "status"  : "Done",
        "name"    : "Invoiced",
        "wId"     : "Sales Order",
        "visible" : true
    },
    {
        "_id"     : ObjectId("580db83bc2acba093649073c"),
        "sequence": 5,
        "status"  : "Pending",
        "name"    : "On hold",
        "wId"     : "Sales Order",
        "visible" : true
    }
];

Workflow.remove({wId: 'Sales Order'}, function (err) {
    if (err) {
        return console.log(err);
    }
    Workflow.collection.insert(newWorkflows, function (err, success) {
        if (err) {
            return console.error(err);
        }

        console.log(success);
    });
});


