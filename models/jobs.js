module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var jobsSchema = mongoose.Schema({
        name     : {type: String, default: ''},
        workflow : {
            _id : {type: ObjectId, ref: 'workflows', default: null},
            name: String
        },
        type     : {type: String, enum: ["Not Quoted", 'Quoted', "Ordered", "Invoiced", "Paid"], default: 'Not Quoted'},
        wTracks  : [{type: ObjectId, ref: 'wTrack', default: null}],
        project  : {
            _id: {type: ObjectId, ref: 'Project', default: null},
            name: String,
            projectManager: JSON
        },
        budget   : {
            _id          : false,
            projectTeam  : {type: Array, default: []},
            projectValues: {type: Array, default: []},
            budget       : {type: Array, default: []},
            budgetTotal  : {type: Object, default: {}}
        },
        quotation: {
            _id : {type: ObjectId, ref: 'Quotation', default: null},
            name: String,
            status: {type: String, default: ''},
            amount: Number
        },
        invoice  : {
            _id : {type: ObjectId, ref: 'Invoice', default: null},
            name: String,
            amount: Number
        },
        payments: [{type: ObjectId, ref: 'Payment', default: null}]

    }, {collection: 'jobs'});

    mongoose.model('jobs', jobsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['jobs'] = jobsSchema;
})();