/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var projectSchema = mongoose.Schema({
        projectShortDesc: {type: String, default: 'emptyProject'},
        projectName     : {type: String, default: 'emptyProject', unique: true},
        task            : [{type: ObjectId, ref: 'Tasks', default: null}],
        customer        : {type: ObjectId, ref: 'Customers', default: null},
        projectmanager  : {type: ObjectId, ref: 'Employees', default: null},
        description     : String,
        whoCanRW        : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups          : {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },
        StartDate       : Date,
        EndDate         : Date,
        TargetEndDate   : Date,
        sequence        : {type: Number, default: 0},
        parent          : {type: String, default: null},
        workflow        : {type: ObjectId, ref: 'workflows', default: null},
        estimated       : {type: Number, default: 0},
        logged          : {type: Number, default: 0},
        remaining       : {type: Number, default: 0},
        progress        : {type: Number, default: 0},
        createdBy       : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        projecttype     : {type: String, default: ''},
        notes           : {type: Array, default: []},
        attachments     : {type: Array, default: []},
        editedBy        : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date}
        },
        health          : {type: Number, default: 1},
        ID              : Number,
        bonus           : [{
            //_id: false,
            employeeId: {
                type: ObjectId,
                ref : 'Employees'
            },
            bonusId   : {
                type: ObjectId,
                ref : 'bonusType'
            },
            startDate : {type: Date, default: null},
            startWeek : Number,
            startYear : Number,
            endDate   : {type: Date, default: null},
            endWeek   : Number,
            endYear   : Number
        }],
        budget          : {
            _id        : false,
            bonus      : Array,
            projectTeam: [{type: ObjectId, ref: "jobs", default: null}]
        }
    }, {collection: 'Project'});

    mongoose.model('Project', projectSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Project'] = projectSchema;
})();