var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var WorkflowSchema = mongoose.Schemas['workflow'];

var connectOptions = {
	user: 'easyerp',
	pass: '1q2w3e!@#',
	w   : 1,
	j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'maxdb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
	console.log("Connection to production is success");
});

var Workflow = dbObject.model("workflows", WorkflowSchema);

var newWorkflows = [
	{
		"_id" : ObjectId("56fabc6b5ad5d96f4fb08eab"),
		"name" : "Unpaid",
		"sequence" : 1,
		"status" : "New",
		"wId" : "Proforma",
		"wName" : "Proforma",
		"visible" : true
	},
	{
		"_id" : ObjectId("56fabcb8e71823e438e4e1c8"),
		"sequence" : 1,
		"status" : "In Progress",
		"name" : "Partially Paid",
		"wId" : "Proforma",
		"visible" : true,
		"__v" : 0
	},
	{
		"_id" : ObjectId("56fabce2e71823e438e4e1c9"),
		"sequence" : 2,
		"status" : "Done",
		"name" : "Paid",
		"wId" : "Proforma",
		"visible" : true,
		"__v" : 0
	},
	{
		"_id" : ObjectId("56fabcf0e71823e438e4e1ca"),
		"sequence" : 3,
		"status" : "Done",
		"name" : "Invoiced",
		"wId" : "Proforma",
		"visible" : true,
		"__v" : 0
	}
];

newWorkflows.forEach(function(wf) {
	Workflow.collection.insert(wf);
});