module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var jobsSchema = mongoose.Schema({
        name     : {type: String, default: ''},
        workflow : {type: ObjectId, ref: 'workflows', default: null},
        type     : {type: String, enum: ["Not Quoted", 'Quoted', "Ordered", "Invoiced", "Paid"], default: 'Not Quoted'},
        wTracks  : [{type: ObjectId, ref: 'wTrack', default: null}],
        project  : {type: ObjectId, ref: 'Project', default: null},
        budget   : {
            _id          : false,
            projectTeam  : {type: Array, default: []},
            projectValues: {type: Array, default: []},
            budget       : {type: Array, default: []},
            budgetTotal  : {type: Object, default: {}}
        },
        quotation: {type: ObjectId, ref: 'Quotation', default: null},
        invoice  : {type: ObjectId, ref: 'Invoice', default: null}
    }, {collection: 'jobs'});

    mongoose.model('jobs', jobsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['jobs'] = jobsSchema;
})();