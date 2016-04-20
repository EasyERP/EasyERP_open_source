/*
 * Update DB jobs with type: "Not Quoted" and revenue, profit great 0
 * */

var mongoose = require('mongoose');

var async = require('async');
var JobsSchema = mongoose.Schemas.jobs;
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111:28017/dendb', connectOptions);

require('../../models/index.js');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {

    var arrayJobs;
    var jobId;
    var Job;
    var jobs;

    console.log('Connection to DB is success');

    Job = dbObject.model('jobs', JobsSchema);

    jobs = Job.find({}, {_id: 1},
        function (err, result) {
            arrayJobs = result;

            async.each(arrayJobs, function (job, cb) {

                jobId = job._id;

                Job.aggregate([{
                    $match: {_id: jobId}
                }, {
                    $unwind: {
                        path                      : '$wTracks',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'wTrack',
                        localField  : 'wTracks',
                        foreignField: '_id',
                        as          : 'wTrack'
                    }
                }, {
                    $project: {
                        wTrack: {$arrayElemAt: ['$wTrack', 0]},
                        budget: 1
                    }
                }, {
                    $group: {
                        _id       : {
                            _id       : '$_id',
                            department: '$wTrack.department',
                            employee  : '$wTrack.employee'
                        },
                        costSum   : {$sum: '$wTrack.cost'},
                        revenueSum: {$sum: '$wTrack.revenue'},
                        hoursSum  : {$sum: '$wTrack.worked'},
                        maxDate   : {$max: '$wTrack.dateByWeek'},
                        minDate   : {$min: '$wTrack.dateByWeek'}
                    }
                }, {
                    $lookup: {
                        from        : 'Department',
                        localField  : '_id.department',
                        foreignField: '_id',
                        as          : 'department'
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : '_id.employee',
                        foreignField: '_id',
                        as          : 'employee'
                    }
                }, {
                    $project: {
                        _id                : '$_id._id',
                        department         : {$arrayElemAt: ['$department', 0]},
                        employee           : {$arrayElemAt: ['$employee', 0]},
                        'budget.costSum'   : '$costSum',
                        'budget.revenueSum': '$revenueSum',
                        'budget.hoursSum'  : '$hoursSum',
                        maxDate            : 1,
                        minDate            : 1
                    }
                }, {
                    $lookup: {
                        from        : 'JobPosition',
                        localField  : 'employee.jobPosition',
                        foreignField: '_id',
                        as          : 'employee.jobPosition'
                    }
                }, {
                    $project: {
                        _id                        : '$_id',
                        'department._id'           : '$department._id',
                        'department.departmentName': '$department.departmentName',
                        'employee._id'             : '$employee._id',
                        'employee.name'            : '$employee.name',
                        'employee.jobPosition'     : {$arrayElemAt: ['$employee.jobPosition', 0]},
                        budget                     : '$budget',
                        maxDate                    : 1,
                        minDate                    : 1
                    }
                }, {
                    $project: {
                        _id                        : '$_id',
                        department                 : '$department',
                        'employee._id'             : '$employee._id',
                        'employee.name'            : '$employee.name',
                        'employee.jobPosition._id' : '$employee.jobPosition._id',
                        'employee.jobPosition.name': '$employee.jobPosition.name',
                        budget                     : '$budget',
                        maxDate                    : 1,
                        minDate                    : 1
                    }
                }, {
                    $group: {
                        _id                : '$_id',
                        projectTeam        : {
                            $push: {
                                department: '$department',
                                employee  : '$employee',
                                budget    : '$budget'
                            }
                        },
                        budgetTotalCost    : {$sum: '$budget.costSum'},
                        budgetTotalRevenue : {$sum: '$budget.revenueSum'},
                        budgetTotalHoursSum: {$sum: '$budget.hoursSum'},
                        maxDate            : {$max: '$maxDate'},
                        minDate            : {$min: '$minDate'}
                    }
                }, {
                    $project: {
                        _id                     : '$_id',
                        projectTeam             : '$projectTeam',
                        'budgetTotal.costSum'   : '$budgetTotalCost',
                        'budgetTotal.revenueSum': '$budgetTotalRevenue',
                        'budgetTotal.hoursSum'  : '$budgetTotalHoursSum',
                        'budgetTotal.maxDate'   : '$maxDate',
                        'budgetTotal.minDate'   : '$minDate'
                    }
                }, {
                    $project: {
                        _id                 : '$_id',
                        'budget.projectTeam': '$projectTeam',
                        'budget.budgetTotal': '$budgetTotal'
                    }
                }
                ], function (err, jobObj) {
                    var _jobId;
                    var jobBudget;

                    if (err) {
                        return console.log(err);
                    }

                    _jobId = jobObj[0]._id;
                    jobBudget = jobObj[0].budget;

                    Job.update({_id: _jobId}, {$set: {budget: jobBudget}}, function (err, res) {
                        if (!err) {
                            console.log(res);
                        } else {
                            console.log(err);
                        }

                    });
                });
            });
        });
});
