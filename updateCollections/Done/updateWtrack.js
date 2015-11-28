/**
 * Created by soundstorm on 06.08.15.
 */

/**
 * Created by Roman on 04.04.2015.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');

var depEnum = {
    QA: '55b92ace21e4b7c40f000011',
    iOS: '55b92ace21e4b7c40f00000f'
};

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
            _id: { type: ObjectId, ref: 'Project', default: null },
            name: String
        },
        workflow: {
            _id: { type: ObjectId, ref: 'workflows', default: null },
            name: String,
            status: String
        },
        customer: {
            _id: { type: ObjectId, ref: 'Customers', default: null },
            name: String
        }
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
    revenue: {type: Number, default: 0},
    cost: {type: Number},
    amount: {type: Number, default: 0},
    isPaid: {type: Boolean, default: false},
    invoice: {type: ObjectId, ref: 'Invoice', default: null},
    info: {
        productType: { type: String, ref: 'productTypes', default: 'wTrack' },
        salePrice: {type: Number, default: 100}
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
    }
}, {collection: 'wTrack'});

var dbObject = mongoose.createConnection('192.168.88.250', 'weTrack');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var wTrack = dbObject.model("wTrack", wTrackSchema);

var query = wTrack.find({'department._id' :null})
    .select('department')
    .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    _res.forEach(function(wt){
        wTrack.findByIdAndUpdate(wt._id, {$set: {'department._id': depEnum[wt.department.departmentName]}}, function(err, response){
            if (err){
                console.log(err);
            }

            console.log(response);
        });
    });
});
