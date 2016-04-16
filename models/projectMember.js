module.exports = (function () {
	var mongoose = require('mongoose');
	var ObjectId = mongoose.Schema.Types.ObjectId;

	var ProjectMemberSchema = mongoose.Schema({
		projectId        : {type: ObjectId, ref: 'Project'},
		employeeId       : {type: ObjectId, ref: 'Employees'},
		bonusId          : {type: ObjectId, ref: 'bonusType'},
		projectPositionId: {type: ObjectId, ref: 'projectPositions'},
		startDate        : {type: Date},
		endDate          : {type: Date}

	}, {collection: 'projectMembers'});

	mongoose.model('ProjectMember', ProjectMemberSchema);

	if (!mongoose.Schemas) {
		mongoose.Schemas = {};
	}

	mongoose.Schemas['ProjectMember'] = ProjectMemberSchema;
})();