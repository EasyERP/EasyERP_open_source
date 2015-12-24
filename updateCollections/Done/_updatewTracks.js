/**
 * Created by lilya on 16/12/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

var wTrackSchema = mongoose.Schema({
    ID: Number,
    dateByWeek: Number,
    dateByMonth: Number,
    project: {
        _id: {
            type: ObjectId, ref: 'Project', default: null
        },
        projectName: String,
        projectmanager: {
            _id: {type: ObjectId, ref: 'Project', default: null},
            name: String
        },
        workflow: {
            _id: {type: ObjectId, ref: 'workflows', default: null},
            name: String,
            status: String
        },
        customer: {
            _id: {type: ObjectId, ref: 'Customers', default: null},
            name: String
        },
        bonus: [{
            employeeId: {
                type: ObjectId,
                ref: 'Employees'
            },
            bonusId: {
                type: ObjectId,
                ref: 'bonusType'
            },
            startDate: Date,
            startWeek: Number,
            startYear: Number,
            endDate: Date,
            endWeek: Number,
            endYear: Number
        }]
    },
    employee: {
        _id: {type: ObjectId, ref: 'Employees', default: null},
        name: String
    },
    department: {
        _id: {type: ObjectId, ref: 'Department', default: null},
        departmentName: String
    },
    year: Number,
    month: Number,
    week: Number,
    1: {type: Number, default: 0},
    2: {type: Number, default: 0},
    3: {type: Number, default: 0},
    4: {type: Number, default: 0},
    5: {type: Number, default: 0},
    6: {type: Number, default: 0},
    7: {type: Number, default: 0},
    worked: Number,
    rate: Number,
    revenue: {type: Number, /*get: getPrice,*/ set: setPrice, default: 0},
    cost: {type: Number, /*get: getPrice,*/ set: setPrice},
    amount: {type: Number, /*get: getPrice,*/ set: setPrice, default: 0},
    isPaid: {type: Boolean, default: false},
    invoice: {type: ObjectId, ref: 'Invoice', default: null},
    info: {
        productType: {type: String, ref: 'productTypes', default: 'wTrack'},
        salePrice: {type: Number, default: 100, set: setPrice}
    },
    whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
    groups: {
        owner: {type: ObjectId, ref: 'Users', default: null},
        users: [{type: ObjectId, ref: 'Users', default: null}],
        group: [{type: ObjectId, ref: 'Department', default: null}]
    },
    editedBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date}
    },
    createdBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },
    jobs: {
        _id: {type: ObjectId, ref: 'jobs', default: null},
        name: {type: String, default: ''}
    }}, {collection: 'wTrack'});

function setPrice(num) {
    return num * 100;
}

mongoose.model('wTrackOld', wTrackSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['wTrackOld'] = wTrackSchema;

var wTrackSchema = mongoose.Schemas['wTrack'];
var wTrackSchemaOld = mongoose.Schemas['wTrackOld'];

var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var wTrackOld = dbObject.model("wTrackNew", wTrackSchemaOld);
var wTrack = dbObject.model("wTrack", wTrackSchema);

var query = wTrackOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    _res.forEach(function(wt){
        var objectToSave = {};
        objectToSave.project = wt.project._id ? wt.project._id : null;
        objectToSave.employee = wt.employee._id ? wt.employee._id : null;
        objectToSave.department = wt.department._id ? wt.department._id : null;
        objectToSave.jobs = wt.jobs._id ? wt.jobs._id : null;

        wTrack.update({_id: wt._id}, objectToSave, function(err, response){
            if (err){
                console.log(err);
            }

            console.log(response);
        });
    });
});
