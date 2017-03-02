module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var jobsSchema = mongoose.Schema({
        name       : {type: String, default: ''},
        number     : {type: String, default: ''},
        description: {type: String, default: ''},
        workflow   : {type: ObjectId, ref: 'workflows', default: null},
        type       : {
            type   : String,
            enum   : ['Not Ordered', 'Ordered', 'Invoiced'],
            default: 'Not Ordered'
        },

        wTracks: [{type: ObjectId, ref: 'wTrack', default: null}],
        project: {type: ObjectId, ref: 'Project', default: null},

        /* budget: {
         _id          : false,
         projectTeam  : {type: Array, default: []},
         projectValues: {type: Array, default: []},
         budget       : {type: Array, default: []},
         budgetTotal  : {type: Object, default: {}}
         },*/

        quotation: {type: ObjectId, ref: 'Quotation', default: null},
        order    : {type: ObjectId, ref: 'Order', default: null},
        invoice  : {type: ObjectId, ref: 'Invoice', default: null},

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        reconcile: {type: Boolean, default: true},
        warehouse: {type: ObjectId, ref: 'warehouse', default: null}
    }, {collection: 'jobs'});

    mongoose.model('jobs', jobsSchema);

    jobsSchema.pre('save', function (next) {
        var job = this;
        var db = job.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'jobs'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            job.number = 'SP' + rate.value.seq;

            next();
        });
    });

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.jobs = jobsSchema;
})();
