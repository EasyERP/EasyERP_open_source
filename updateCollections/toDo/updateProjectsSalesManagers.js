var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

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

projectSchema.set('toJSON', {virtuals: true});

mongoose.model('ProjectOld', projectSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['ProjectOld'] = projectSchema;

var ProjectSchema = mongoose.Schemas['Project'];
var ProjectSchemaOld = mongoose.Schemas['ProjectOld'];

//var dbObject = mongoose.createConnection('localhost', 'production');

var connectOptions = {
    user  : 'easyerp',
    pass  : '1q2w3e!@#',
    w     : 1,
    j     : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);

var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Project = dbObject.model("Project", ProjectSchema);
var ProjectOld = dbObject.model("ProjectOld", ProjectSchemaOld);

var query = ProjectOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 50, function (project, callback) {
        var objectToSave;
        var salesMananagers = [{
            manager: project.projectmanager,
            date   : project.StartDate || new Date()
        }];

        objectToSave = {
            salesManagers: salesMananagers
        };

        Project.update({_id: project._id}, {$set: objectToSave}, function (err) {
            if (err) {
                callback(err);
            }
            callback();
        });

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});
