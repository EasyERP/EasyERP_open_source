/**
 * Created by liliya on 22.10.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var jobsSchema = mongoose.Schema({
        name: { type: String, default: '' },
        workflow: { type: ObjectId, ref: 'workflows', default: null },
        type: {type: String, enum: ['Quotation', "Order", "Invoice", "Empty"], default: 'Empty'},
        wTracks : [{type: ObjectId, ref: 'wTrack', default: null}],
        project: {type: ObjectId, ref: 'Project', default: null},
        budget: {
            _id: false,
            projectTeam: {type: Array, default: []},
            budget: {type: Array, default: []},
            budgetTotal:{type: Array, default: []}
        }

    }, { collection: 'jobs' });

    mongoose.model('jobs', jobsSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['jobs'] = jobsSchema;
})();