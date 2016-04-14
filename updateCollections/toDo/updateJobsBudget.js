
/*
* Update DB jobs with type: "Not Quoted" and revenue, profit great 0
* */

var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var JobsSchema = mongoose.Schemas['jobs'];

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w: 1,
    j: true
};

var dbObject = mongoose.createConnection('144.76.56.111:28017/dendb', connectOptions);

//var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {

    var arrayJobs;
    var i;
    var jobId;

    console.log("Connection to production is success");

    var Job = dbObject.model("jobs", JobsSchema);

    var jobs = Job.find({}, {_id: 1},
        function (err, result) {
            arrayJobs = result;

            for (i = 0; i < arrayJobs.length; i++) {
                jobId = arrayJobs[i]._id;

                Job.aggregate([
                    {$match: {_id: jobId}},
                    {$unwind : {
                        path: "$wTracks",
                        preserveNullAndEmptyArrays: true}},
                    {$lookup : {
                        from:"wTrack",
                        localField: "wTracks",
                        foreignField: "_id",
                        as: "wTrack"}},

                    {$project: {
                        wTrack : {$arrayElemAt: ["$wTrack", 0]},
                        budget: 1
                    }},

                    {$group: {
                        _id: {
                            _id: "$_id",
                            department: "$wTrack.department",
                            employee: "$wTrack.employee"
                        },
                        costSum: { $sum: "$wTrack.cost" },
                        revenueSum: { $sum: "$wTrack.revenue" },
                        hoursSum: { $sum: "$wTrack.worked" },
                        maxDate: {$max : "$wTrack.dateByWeek"},
                        minDate: {$min : "$wTrack.dateByWeek"}
                    }
                    },

                    {$lookup: {
                        from:"Department",
                        localField: "_id.department",
                        foreignField: "_id",
                        as: "department"
                    }
                    },

                    {$lookup: {
                        from:"Employees",
                        localField: "_id.employee",
                        foreignField: "_id",
                        as: "employee"
                    }},

                    {$project: {
                        _id: "$_id._id",
                        department : {$arrayElemAt: ["$department", 0]},
                        employee : {$arrayElemAt: ["$employee", 0]},
                        "budget.costSum": "$costSum",
                        "budget.revenueSum": "$revenueSum",
                        "budget.hoursSum": "$hoursSum",
                        maxDate:  1,
                        minDate:  1
                    }},

                    {$lookup: {
                        from:"JobPosition",
                        localField: "employee.jobPosition",
                        foreignField: "_id",
                        as: "employee.jobPosition"
                    }
                    },

                    {$project: {
                        _id: "$_id",
                        "department._id" : "$department._id",
                        "department.departmentName" : "$department.departmentName",
                        "employee._id" : "$employee._id",
                        "employee.name" : "$employee.name",
                        "employee.jobPosition" : {$arrayElemAt: ["$employee.jobPosition", 0]},
                        budget : "$budget",
                        maxDate:  1,
                        minDate:  1
                    }},

                    {$project: {
                        _id: "$_id",
                        "department" : "$department",
                        "employee._id" : "$employee._id",
                        "employee.name" : "$employee.name",
                        "employee.jobPosition._id" : "$employee.jobPosition._id",
                        "employee.jobPosition.name" : "$employee.jobPosition.name",
                        budget : "$budget",
                        maxDate:  1,
                        minDate:  1
                    }},

                    {$group: {
                        _id: {
                            _id: "$_id"
                        },
                        projectTeam: {$push : {department: "$department", employee: "$employee", budget: "$budget"}},
                        budgetTotalCost: { $sum: "$budget.costSum" },
                        budgetTotalRevenue: { $sum: "$budget.revenueSum" },
                        budgetTotalHoursSum: { $sum: "$budget.hoursSum" },
                        maxDate: { $max: "$maxDate" },
                        minDate: { $min: "$minDate" }
                    }},

                    {$project: {
                        _id: "$_id._id",
                        projectTeam: "$projectTeam",
                        "budgetTotal.costSum": "$budgetTotalCost",
                        "budgetTotal.revenueSum": "$budgetTotalRevenue",
                        "budgetTotal.hoursSum": "$budgetTotalHoursSum",
                        "budgetTotal.maxDate": "$maxDate",
                        "budgetTotal.minDate": "$minDate"
                    }
                    },

                    {$project: {
                        _id: "$_id",
                        "budget.projectTeam": "$projectTeam",
                        "budget.budgetTotal": "$budgetTotal"
                    }
                    }
                ], function(err, jobObj) {
                    if (err) {
                        return console.log(err);
                    }

                    //var jobId = jobObj._id;
                    var jobBudget = jobObj[0].budget;

                    Job.update({_id: jobId}, {$set: {"budget": jobBudget}}, function(err, res){
                        if(!err){
                            console.log(res);
                        } else {
                            console.log(err);
                        }

                    });
                });
            }
        });
});