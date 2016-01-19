require('../../models/index.js');

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');
var _ = require('lodash');

var WtrackSchema = mongoose.Schemas['wTrack'];
var QuotationSchema = mongoose.Schemas['Quotation'];
var JobSchema = mongoose.Schemas['jobs'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var Wtrack = dbObject.model("wTrack", WtrackSchema);
var Quotation = dbObject.model("Quotation", QuotationSchema);
var Job = dbObject.model("jobs", JobSchema);

var query = Job
    .aggregate([{
        $lookup:{
            from: 'Quotation',
            localField: 'quotation',
            foreignField: '_id',
            as: 'quotation'
        }
    }, {
        $project: {
            payments: 1,
            quotation: {$arrayElemAt: ["$quotation", 0]},
            wTracks: 1,
            budget: 1,
            projectTeam: 1,
            /*newRevenue: {
                $let: {
                    vars: {
                        total: {$multiply: [{$year: "$invoiceDate"}, 100]}
                    },
                    in  : {$add: ["$$total", {$week: "$invoiceDate"}]}
                }
            }*/
        }
    }]);

query.exec(function (error, response) {
    if (error) {
        return console.dir(error);
    }

    console.log(response);
});

