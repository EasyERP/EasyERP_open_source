var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var projectPositionSchem = mongoose.Schemas['projectPosition'];

var connectOptions = {
	user: 'easyerp',
	pass: '1q2w3e!@#',
	w   : 1,
	j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
	console.log("Connection to production is success");
});

var ProjectPosition = dbObject.model("projectPosition", projectPositionSchem);

var newProjectPositions = [
	{
		"_id" : ObjectId("570e9a75785753b3f1d9c86e"),
		"name" : "Sales manager"
	},
	{
		"_id" : ObjectId("570e9a75785753b3f1d9c86f"),
		"name" : "Project manager"
	},
	{
		"_id" : ObjectId("570e9a75785753b3f1d9c870"),
		"name" : "Marketer"
	},
	{
		"_id" : ObjectId("570e9a75785753b3f1d9c871"),
		"name" : "Developer"
	},
	{
		"_id" : ObjectId("570e9a75785753b3f1d9c872"),
		"name" : "Team lead"
	},
	{
		"_id" : ObjectId("570e9a75785753b3f1d9c873"),
		"name" : "Reference person"
	}
];

ProjectPosition.collection.insert(newProjectPositions);
