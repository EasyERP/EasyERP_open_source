var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

var projectSchema = mongoose.Schema({
    projectShortDesc: {type: String, default: 'emptyProject'},
    projectName: {type: String, default: 'emptyProject', unique: true},
    task: [{type: ObjectId, ref: 'Tasks', default: null}],
    customer: {type: ObjectId, ref: 'Customers', default: null},
    projectmanager: {type: ObjectId, ref: 'Employees', default: null},
    salesManagers: [{
        _id: false,
        manager: {type: ObjectId, ref: 'Employees', default: null},
        startDate: {type: Date, default: null},
        endDate: {type: Date, default: null}
    }],
    projectManagers: [{
        _id: false,
        manager: {type: ObjectId, ref: 'Employees', default: null},
        startDate: {type: Date, default: null},
        endDate: {type: Date, default: null}
    }],
    description: String,
    whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
    groups: {
        owner: {type: ObjectId, ref: 'Users', default: null},
        users: [{type: ObjectId, ref: 'Users', default: null}],
        group: [{type: ObjectId, ref: 'Department', default: null}]
    },
    StartDate: Date,
    EndDate: Date,
    TargetEndDate: Date,
    sequence: {type: Number, default: 0},
    parent: {type: String, default: null},
    workflow: {type: ObjectId, ref: 'workflows', default: null},
    estimated: {type: Number, default: 0},
    logged: {type: Number, default: 0},
    remaining: {type: Number, default: 0},
    progress: {type: Number, default: 0},
    createdBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },
    projecttype: {type: String, default: ''},
    notes: {type: Array, default: []},
    attachments: {type: Array, default: []},
    editedBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date}
    },
    health: {type: Number, default: 1},
    ID: Number,
    bonus: [{
        //_id: false,
        employeeId: {
            type: ObjectId,
            ref: 'Employees'
        },
        bonusId: {
            type: ObjectId,
            ref: 'bonusType'
        },
        startDate: {type: Date, default: null},
        startWeek: Number,
        startYear: Number,
        endDate: {type: Date, default: null},
        endWeek: Number,
        endYear: Number
    }],
    budget: {
        _id: false,
        bonus: Array,
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
var projectMemberSchema = mongoose.Schemas['ProjectMember'];

//var dbObject = mongoose.createConnection('localhost', 'production');

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w: 1,
    j: true
};

var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Project = dbObject.model("Project", ProjectSchema);
var ProjectOld = dbObject.model("ProjectOld", ProjectSchemaOld);
var ProjectMember = dbObject.model("ProjectMember", projectMemberSchema);


var query = ProjectOld.find({}).lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachSeries(_res, function (project, callback) {
        var parallelTasks = [];
        var fieldsToDelete = {
            'salesManagers': '',
            'projectManagers': '',
            'bonus': ''
        };

        function SalesMember(prCallback) {
            var manager = project.salesManagers[0];

            var bonusId = null;
            var projectMember;
            if (project.bonus && project.bonus.length) {
                project.bonus.forEach(function (bonus) {
                    if (bonus.employeeId.toString() === manager.manager.toString()) {
                        bonusId = bonus.bonusId;
                        return;
                    }
                });
            }
            projectMember = new ProjectMember({
                projectId: project._id,
                employeeId: manager.manager,
                bonusId: bonusId,
                projectPositionId: "570e9a75785753b3f1d9c86e",
                startDate: manager.startDate,
                endDate: manager.endDate
            });
            projectMember.save(function (err, doc) {
                if (err) {
                    prCallback(err);
                }
                prCallback(null, doc._id);
            });
        }

        function customerMember(prCallback) {
            var customerBonus = project.bonus.filter(function (obj) {
                return obj.bonusId.toString() === '55b92ad521e4b7c40f000604';
            })[0];

            var referencer;
            if (customerBonus) {
                referencer = new ProjectMember({
                    projectId: project._id,
                    employeeId: customerBonus.employeeId,
                    bonusId: customerBonus.bonusId,
                    projectPositionId: "570e9a75785753b3f1d9c873",
                    startDate: customerBonus.startDate,
                    endDate: customerBonus.endDate
                });
                referencer.save(function (err, doc) {
                    if (err) {
                        prCallback(err);
                        return;
                    }
                    prCallback(null, doc._id);
                });
            } else {
                prCallback();
            }
        }

        if (project.salesManagers && project.salesManagers.length) {
            parallelTasks.push(SalesMember);
        }
        if (project.bonus && project.bonus.length) {
            parallelTasks.push(customerMember);
        }

        if (parallelTasks.length) {
            async.parallel(parallelTasks, function (err, results) {
                if (err) {
                    callback(err);
                    return;
                }

                Project.update({_id: project._id}, {$set: {projectMembers: results}, $unset: fieldsToDelete},
                    {strict: false}, callback);
            });
        } else {
            Project.update({_id: project._id}, {$set: {projectMembers: []}, $unset: fieldsToDelete},
                {strict: false}, callback);
        }

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});
