/**
 * Created by liliya on 22.10.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var jobsSchema = mongoose.Schema({
        name: { type: String, default: '' },
        workflow: {
            _id: { type: ObjectId, ref: 'workflows', default: null },
            name: String
        },
        type: {type: String, enum: ['Quoted', "Ordered", "Invoiced", "Payed", "Not Quoted"], default: 'Not Quoted'},
        wTracks : [{type: ObjectId, ref: 'wTrack', default: null}],
        project: {type: ObjectId, ref: 'Project', default: null},
        budget: {
            _id: false,
            projectTeam: {type: Array, default: []},
            projectValues: {type: Array, default: []},
            budget: {type: Array, default: []},
            budgetTotal:{type: Object, default: {}}
        }

    }, { collection: 'jobs' });

    mongoose.model('jobs', jobsSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['jobs'] = jobsSchema;
})();