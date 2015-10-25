/**
 * Created by liliya on 25.10.15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');
var QuotationSchema = mongoose.Schemas['Quotation'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var JobsSchema = mongoose.Schemas['jobs'];
var ProjectSchema = mongoose.Schemas['Project'];
var objectId = mongoose.Types.ObjectId;

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
    }
}, {collection: 'wTrack'});

function setPrice(num) {
    return num * 100;
}

wTrackSchema.set('toJSON', {getters: true});

mongoose.model('wTrackOld', wTrackSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['wTrackOld'] = wTrackSchema;


var WTrackSchema = mongoose.Schemas['wTrack'];
var WTrackSchemaOld = mongoose.Schemas['wTrackOld'];

var dbObject = mongoose.createConnection('localhost', 'weTrack');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var wTrack = dbObject.model("wTrack", WTrackSchema);
var wTrackOld = dbObject.model("wTrackOld", WTrackSchemaOld);

var Quotation = dbObject.model("Quotation", QuotationSchema);
var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
var Job = dbObject.model("jobs", JobsSchema);
var Project = dbObject.model("Project", ProjectSchema);

var waterfallTasks = [getInvoices, createJobs];

async.waterfall(waterfallTasks, function(err, result){
    console.log('success');
    //
    //Job.aggregate([
    //    {
    //        $group: {
    //            _id: "$project",
    //            jobIds: {$addToSet: '$_id'}
    //        }
    //    }
    //], function(err, result){
    //    if (err) {
    //        return console.log(err);
    //    }
    //
    //    result.forEach(function(res){
    //
    //        var projectId = res._id;
    //        var jobIds = res.jobIds;
    //
    //        Project.findByIdAndUpdate(projectId, {$set : {budget: {}}}, function(err, result){
    //            if (err){
    //                console.log(err);
    //            }
    //            console.log('ok');
    //        });
    //
    //    })
    //})

});

function getInvoices(pCb){
    wTrack.aggregate([
        {
          $match: {
              isPaid: false
          }
        },
        {
            $group: {
                _id: "$project._id",
                ids: {$addToSet: '$_id'}
            }
        }
    ], function(err, result) {
        if (err) {
            return console.log(err);
        }
        pCb(null, result);
    })

    }

function createJobs(wTrackArray, pcb){


    wTrackArray.forEach(function(wTr, count){
        var projectId = wTr._id;
        var wTracks = wTr.ids;
        var jobName = count;

        data = {
            name: jobName,
            workflow: {
                _id: objectId("56289f0713a9b6747c1c78af"),
                name: "In Progress"
            },
            type: "Empty",
            wTracks: wTracks,
            project: projectId
        };

        var newJob = new Job(data);

        newJob.save(function (err, job) {
            if (err) {
                return pcb(err);
            }

            var jobId = job.toJSON()._id;
            var jobName = job.get('name');

            var jobForwTrack = {
                _id: objectId(jobId),
                name: jobName
            };

            wTracks.forEach(function(wTrackId){
                wTrack.findByIdAndUpdate(objectId(wTrackId), {$set : {jobs: jobForwTrack}}, function(err, result){
                    if (err){
                        console.log(err);
                    }
                });
            });

        });



    });

}
