

var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');

var moment = require('../public/js/libs/moment/moment');

var wTrack = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var BonusTypeSchema = mongoose.Schemas['bonusType'];
    var monthHoursSchema = mongoose.Schemas['MonthHours'];
    var vacationSchema = mongoose.Schemas['Vacation'];
    var holidaysSchema = mongoose.Schemas['Holiday'];
    var employeeSchema = mongoose.Schemas['Employee'];

    this.bySales = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startWeek = parseInt(options.week);
            var startYear = parseInt(options.year);
            var endWeek;
            var endYear;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            if (startWeek >= 40) {
                endWeek = parseInt(startWeek) + 14 - 53;
                endYear = parseInt(startYear) + 1;
            } else {
                endWeek = parseInt(startWeek) + 14;
                endYear = parseInt(startYear);
            }

            startDate = startYear * 100 + startWeek;
            endDate = endYear * 100 + endWeek;

            match = {
                $and: [
                    {'project._id': {$exists: true}},
                    {'project._id': {$ne: null}},
                    {dateByWeek: {$gte: startDate, $lt: endDate}}
                ]
            };

            groupBy = {
                _id: {
                    employee: '$project.projectmanager._id',
                    year: '$year',
                    week: '$week'
                },
                revenue: {$sum: {$multiply: ["$rate", {$add: ["$1", "$2", "$3", "$4", "$5", "$6", "$7"]}]}}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $group: groupBy
            }, {
                $project: {
                    year: "$_id.year",
                    week: "$_id.week",
                    employee: "$_id.employee",
                    revenue: 1,
                    _id: 0
                }
            }, {
                $group: {
                    _id: "$employee",
                    root: {$push: "$$ROOT"},
                    total: {$sum: "$revenue"}
                }
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };

    this.byDepartment = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startWeek = parseInt(options.week);
            var startYear = parseInt(options.year);
            var endWeek;
            var endYear;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            if (startWeek >= 40) {
                endWeek = parseInt(startWeek) + 14 - 53;
                endYear = parseInt(startYear) + 1;
            } else {
                endWeek = parseInt(startWeek) + 14;
                endYear = parseInt(startYear);
            }

            //startDate = dateCalc(startWeek, startYear);
            //endDate = dateCalc(endWeek, endYear);
            startDate = startYear * 100 + startWeek;
            endDate = endYear * 100 + endWeek;

            match = {
                dateByWeek: {
                    $gte: startDate,
                    $lt: endDate
                }
            };

            groupBy = {
                _id: {
                    department: '$department.departmentName',
                    _id: '$department._id',
                    year: '$year',
                    week: '$week'
                },
                revenue: {$sum: {$multiply: ["$rate", {$add: ["$1", "$2", "$3", "$4", "$5", "$6", "$7"]}]}}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $group: groupBy
            }, {
                $project: {
                    year: "$_id.year",
                    week: "$_id.week",
                    department: "$_id.department",
                    revenue: 1,
                    _id: 0
                }
            }, {
                $group: {
                    _id: "$department",
                    root: {$push: "$$ROOT"},
                    total: {$sum: "$revenue"}
                }
            }, {
                $sort: {_id: 1}
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };

    this.paidwtrack = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            startDate = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDate = parseInt(options.endDate) || (endYear * 100 + endMonth);

            match = {
                $and: [
                    {'project._id': {$exists: true}},
                    {'project._id': {$ne: null}},
                    {dateByMonth: {$gte: startDate, $lte: endDate}}
                ]
            };

            groupBy = {
                _id: {
                    assigned: '$project.projectmanager._id',
                    month: '$month',
                    year: '$year'
                },
                revenue: {$sum: '$amount'},
                dateByMonth: {$addToSet: '$dateByMonth'}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $group: groupBy
            }, {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    employee: "$_id.assigned",
                    revenue: 1,
                    dateByMonth: 1,
                    _id: 0
                }
            }, {
                $group: {
                    _id: "$employee",
                    root: {$push: "$$ROOT"},
                    total: {$sum: "$revenue"}
                }
            }, {
                $sort: {
                    dateByMonth: -1
                }
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };

    this.unpaidwtrack = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            startDate = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDate = parseInt(options.endDate) || (endYear * 100 + endMonth);

            match = {
                $and: [
                    {'project._id': {$exists: true}},
                    {'project._id': {$ne: null}},
                    {'project.workflow.status': {$ne: 'Cancelled'}},
                    {dateByMonth: {$gte: startDate, $lte: endDate}}
                ]
            };

            groupBy = {
                _id: {
                    assigned: '$project.projectmanager._id',
                    month: '$month',
                    year: '$year'
                },
                revenue: {$sum: '$revenue'},
                amount: {$sum: '$amount'},
                dateByMonth: {$addToSet: '$dateByMonth'}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $project: {
                    project: 1,
                    month: 1,
                    year: 1,
                    revenue: 1,
                    amount: 1,
                    diff: {$subtract: ["$revenue", "$amount"]},
                    dateByMonth: 1,
                    _id: 1
                }
            }, {
                $match: {diff: {$gte: 0}}
            }, {
                $group: groupBy
            }, {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    employee: "$_id.assigned",
                    revenue: {$subtract: ["$revenue", "$amount"]},
                    dateByMonth: 1,
                    _id: 0
                }
            }, {
                $match: {
                    revenue: {$gt: 0}
                }
            }, {
                $group: {
                    _id: "$employee",
                    root: {$push: "$$ROOT"},
                    total: {$sum: "$revenue"}
                }
            }, {
                $sort: {
                    dateByMonth: -1
                }
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                console.log('======================================================');
                console.log(startDate);
                console.log('======================================================');

                res.status(200).send(response);
            });

        });
    };

    this.cancelledWtrack = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            startDate = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDate = parseInt(options.endDate) || (endYear * 100 + endMonth);

            match = {
                $and: [
                    {'project._id': {$exists: true}},
                    {'project._id': {$ne: null}},
                    {'project.workflow.status': 'Cancelled'},
                    {dateByMonth: {$gte: startDate, $lte: endDate}}
                ]
            };

            groupBy = {
                _id: {
                    assigned: '$project.projectmanager._id',
                    month: '$month',
                    year: '$year'
                },
                revenue: {$sum: '$revenue'},
                amount: {$sum: '$amount'},
                dateByMonth: {$addToSet: '$dateByMonth'}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $project: {
                    project: 1,
                    month: 1,
                    year: 1,
                    revenue: 1,
                    amount: 1,
                    diff: {$subtract: ["$revenue", "$amount"]},
                    dateByMonth: 1,
                    _id: 1
                }
            }, {
                $match: {diff: {$gte: 0}}
            }, {
                $group: groupBy
            }, {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    employee: "$_id.assigned",
                    revenue: {$subtract: ["$revenue", "$amount"]},
                    dateByMonth: 1,
                    _id: 0
                }
            }, {
                $match: {
                    revenue: {$gt: 0}
                }
            }, {
                $group: {
                    _id: "$employee",
                    root: {$push: "$$ROOT"},
                    total: {$sum: "$revenue"}
                }
            }, {
                $sort: {
                    dateByMonth: -1
                }
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };

    this.projectBySales = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            startDate = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDate = parseInt(options.endDate) || (endYear * 100 + endMonth);

            match = {
                $and: [
                    {'project._id': {$exists: true}},
                    {'project._id': {$ne: null}},
                    {dateByMonth: {$gte: startDate, $lte: endDate}}
                ]
            };

            groupBy = {
                _id: {
                    project: '$project._id',
                    assigned: '$project.projectmanager._id',
                    month: '$month',
                    year: '$year'
                },
                count: {$sum: 1},
                dateByMonth: {$addToSet: '$dateByMonth'}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $group: groupBy
            }, {
                $group: {
                    _id: {
                        assigned: '$_id.assigned',
                        month: '$_id.month',
                        year: '$_id.year'
                    },
                    projectCount: {$sum: 1}
                }
            }, {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    employee: "$_id.assigned",
                    dateByMonth: 1,
                    projectCount: 1,
                    _id: 0
                }
            }, {
                $group: {
                    _id: '$employee',
                    root: {$push: '$$ROOT'},
                    total: {$sum: '$projectCount'}
                }
            }, {
                $sort: {
                    month: -1
                }
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };

    this.employeeBySales = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            startDate = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDate = parseInt(options.endDate) || (endYear * 100 + endMonth);

            match = {
                $and: [
                    {'project._id': {$exists: true}},
                    {'project._id': {$ne: null}},
                    {dateByMonth: {$gte: startDate, $lte: endDate}}
                ]
            };

            groupBy = {
                _id: {
                    project: '$project._id',
                    assigned: '$project.projectmanager._id',
                    employee: '$employee._id',
                    month: '$month',
                    year: '$year'
                },
                dateByMonth: {$addToSet: '$dateByMonth'}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $group: groupBy
            }, {
                $group: {
                    _id: {
                        assigned: '$_id.assigned',
                        employee: '$employee._id',
                        month: '$_id.month',
                        year: '$_id.year'
                    },
                    projectCount: {$sum: 1}
                }
            }, {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    employee: "$_id.assigned",
                    dateByMonth: 1,
                    projectCount: 1,
                    _id: 0
                }
            }, {
                $group: {
                    _id: '$employee',
                    root: {$push: '$$ROOT'},
                    total: {$sum: '$projectCount'}
                }
            }, {
                $sort: {
                    month: -1
                }
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };

    this.hoursByDep = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startWeek = parseInt(options.week);
            var startYear = parseInt(options.year);
            var endWeek;
            var endYear;
            var startDate;
            var endDate;
            var match;
            var groupBy;

            if (!access) {
                return res.status(403).send();
            }

            if (startWeek >= 40) {
                endWeek = parseInt(startWeek) + 14 - 53;
                endYear = parseInt(startYear) + 1;
            } else {
                endWeek = parseInt(startWeek) + 14;
                endYear = parseInt(startYear);
            }

            startDate = startYear * 100 + startWeek;
            endDate = endYear * 100 + endWeek;

            match = {
                dateByWeek: {
                    $gte: startDate,
                    $lt: endDate
                }
            };

            groupBy = {
                _id: {
                    department: '$department.departmentName',
                    _id: '$department._id',
                    year: '$year',
                    week: '$week'
                },
                sold: {$sum: '$worked'}
            };

            WTrack.aggregate([{
                $match: match
            }, {
                $group: groupBy
            }, {
                $project: {
                    year: "$_id.year",
                    week: "$_id.week",
                    department: "$_id.department",
                    sold: 1,
                    _id: 0
                }
            }, {
                $group: {
                    _id: '$department',
                    root: {$push: '$$ROOT'},
                    totalSold: {$sum: '$sold'}
                }
            }, {
                $sort: {_id: 1}
            }], function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(response);
            });

        });
    };


    this.allBonus = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var BonusType = models.get(req.session.lastDb, 'bonusType', BonusTypeSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDateByWeek;
            var startDate;
            var endDateByWeek;
            var endDate;
            var waterfallTasks;
            var projectIds;

            var startMomentDate = moment().isoWeekYear(startYear).month(startMonth - 1);
            var endMomentDate = moment().isoWeekYear(endYear).month(endMonth - 1);

            var startWeek = startMomentDate.isoWeek();
            var endWeek = endMomentDate.isoWeek();

            startDate = startMomentDate.date(1).toDate();
            endDate = endMomentDate.date(31).toDate();

            startDateByWeek = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDateByWeek = parseInt(options.endDate) || (endYear * 100 + endMonth);

            var idForProjects = function (callback) {
                Project.aggregate([{
                    $project: {
                        _id: 1,
                        bonus: 1,
                        bonusCount: {$size: '$bonus'}
                    }
                }, {
                    $match: {
                        $and: [{
                            bonusCount: {$gt: 0}
                        }, {
                            $or: [{
                                $or: [{
                                    'bonus.startDate': null
                                }, {
                                    'bonus.endDate': null
                                }]
                            }, {
                                $or: [{
                                    'bonus.startDate': {$gte: startDate}
                                }, {
                                    'bonus.endDate': {$lte: endDate}
                                }]
                            }]
                        }]
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                }], function (err, response) {
                    if (err) {
                        return callback(err);
                    }

                    response = _.pluck(response, '_id');

                    callback(null, response);
                });
            };

            function getWTracksByProjects(_ids, callback) {
                var queryObject = {};

                projectIds = _ids;

                queryObject['$and'] = [
                    {'dateByMonth': {'$gte': startDateByWeek}},
                    {'dateByMonth': {'$lte': endDateByWeek}},
                    {'project._id': {'$in': projectIds}}
                ];

                WTrack.aggregate([
                    {
                        $match: queryObject
                    }, {
                        $group: {
                            _id: {
                                name: '$project.projectName',
                                _id: '$project._id',
                                dateByMonth: '$dateByMonth'
                            },
                            ids: {$addToSet:'$project._id'},
                            revenue: {$sum: {$subtract: ['$revenue', '$cost']}}
                        }
                    }, {
                        $project: {
                            projectName: '$_id.name',
                            _id: '$_id._id',
                            dateByMonth: '$_id.dateByMonth',
                            revenue: 1
                        }
                    }, {
                        $group: {
                            _id: '$dateByMonth',
                            root: {$addToSet: '$$ROOT'}
                        }
                    } , {
                        $sort: {
                            _id: 1
                        }
                    }], function (err, result) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                });
            };

            function getProjectsByIds(wTracks, callback) {
                //var _ids = _.pluck(wTracks, 'project._id');

                Project.aggregate([
                    {
                        $match: {
                            _id: {'$in': projectIds}
                        }
                    },
                    {
                        $unwind: '$bonus'
                    },
                    {
                        $group: {
                            _id: {
                                employeeId: '$bonus.employeeId',
                                bonusId: '$bonus.bonusId'
                            },
                            projects: {
                                $addToSet: {
                                    _id: '$_id',
                                    name: '$projectName'
                                }
                            }

                        }
                    }, {
                        $project: {
                            employee: '$_id.employeeId',
                            bonus: '$_id.bonusId',
                            projects: 1,
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: '$employee',
                            root: {$push: '$$ROOT'}
                        }
                    }
                ], function (err, projects) {
                    if (err) {
                        return callback(err)
                    }

                    Employee.populate(projects, {
                        path: '_id',
                        match: {'department._id': '55b92ace21e4b7c40f000014'},
                        select: '_id name',
                        options: {
                            lean: true
                        }
                    }, function(err, employees){
                        if(err){
                            return callback(err);

                        }

                        projects = _.filter(projects, function(employee){
                            if(employee._id){
                                return employee;
                            }
                        });

                        BonusType.populate(projects, {
                            path: 'root.bonus',
                            select: '_id name value',
                            options: {
                                lean: true
                            }
                        }, function(err, types){
                            if(err){
                                return callback(err);

                            }

                            callback(null, {wTracks: wTracks, projects: projects});
                        });
                    });

                });
            };

            function getBonuses(wTracks, callback) {
                var _ids = _.pluck(wTracks, 'project._id');

                Project.aggregate([
                    {
                        $match: {
                            _id: {'$in': _ids}
                        }
                    },
                    {
                        $unwind: '$bonus'
                    },
                    {
                        $group: {
                            _id: {employeeId: '$bonus.employeeId', bonusId: '$bonus.bonusId'},
                            dateArray: {
                                $push: {
                                    startDate: '$bonus.startDate',
                                    endDate: '$bonus.endDate',
                                    projectId: '$_id'
                                }
                            }

                        }
                    }
                ], callback);
            };


            if (!access) {
                return res.status(403).send();
            }

            waterfallTasks = [idForProjects, getWTracksByProjects, getProjectsByIds];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                result = resultGenerator(result);

                res.status(200).send(result);
            });

            function resultGenerator(projectsWetrackObject){
                var employees = [];
                var groupedEmployees = projectsWetrackObject.projects;
                var groupedWtracks = projectsWetrackObject.wTracks;
                var employee;
                var _employee;
                var dateStr;
                var groupedEmployee;
                var totalByBonus;
                var bonusObject;

                //iterate over grouped result of projects with bonus by Employee
                for(var i = groupedEmployees.length; i--;){
                    totalByBonus = 0;

                    groupedEmployee = groupedEmployees[i];
                    _employee = groupedEmployee._id;
                    employee = {
                        _id: _employee._id,
                        name: _employee.name.first + ' ' + _employee.name.last,
                        total: 0
                    };
                    //iterate over grouped result of wTrack by date and projects
                    for(var j = groupedWtracks.length; j--;){
                        dateStr = groupedWtracks[j]._id;
                        /*employee[dateStr] = [];*/
                        bonusObject = {
                            total: 0
                        };
                        for(var m  = groupedEmployee.root.length; m--; ){
                            /*bonusObject = {
                             total: 0
                             };*/
                            totalByBonus = 0;

                            for(var k = groupedWtracks[j].root.length; k--;) {

                                for (var l = groupedEmployee.root[m].projects.length; l--;){
                                    if (groupedWtracks[j].root[k]._id.toString() === groupedEmployee.root[m].projects[l]._id.toString()) {
                                        totalByBonus += (groupedEmployee.root[m].bonus.value * groupedWtracks[j].root[k].revenue / 100) / 100;
                                    }
                                }

                            }
                            bonusObject[groupedEmployee.root[m].bonus.name] = totalByBonus;
                            bonusObject.total += totalByBonus;
                            bonusObject.total = parseFloat(bonusObject.total.toFixed(2));
                            /*employee[dateStr].push(bonusObject);*/
                        }
                        employee.total += bonusObject.total;
                        employee.total = parseFloat(employee.total.toFixed(2));
                        employee[dateStr] = bonusObject;
                    }

                    employees.push(employee);
                }

                return employees;
            }

        });
    };

    this.uncalcBonus = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var BonusType = models.get(req.session.lastDb, 'bonusType', BonusTypeSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDateByWeek;
            var startDate;
            var endDateByWeek;
            var endDate;
            var waterfallTasks;
            var projectIds;

            var startMomentDate = moment().isoWeekYear(startYear).month(startMonth - 1);
            var endMomentDate = moment().isoWeekYear(endYear).month(endMonth - 1);

            var startWeek = startMomentDate.isoWeek();
            var endWeek = endMomentDate.isoWeek();

            startDate = startMomentDate.date(1).toDate();
            endDate = endMomentDate.date(31).toDate();

            startDateByWeek = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDateByWeek = parseInt(options.endDate) || (endYear * 100 + endMonth);

            var idForProjects = function (callback) {
                Project.aggregate([{
                    $project: {
                        _id: 1,
                        bonus: 1,
                        bonusCount: {$size: '$bonus'}
                    }
                }, {
                    $match: {
                        $and: [{
                            bonusCount: {$gt: 0}
                        }, {
                            $or: [{
                                $or: [{
                                    'bonus.startDate': null
                                }, {
                                    'bonus.endDate': null
                                }]
                            }, {
                                $or: [{
                                    'bonus.startDate': {$gte: startDate}
                                }, {
                                    'bonus.endDate': {$lte: endDate}
                                }]
                            }]
                        }]
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                }], function (err, response) {
                    if (err) {
                        return callback(err);
                    }

                    response = _.pluck(response, '_id');

                    callback(null, response);
                });
            };

            function getWTracksByProjects(_ids, callback) {
                var queryObject = {};

                projectIds = _ids;

                queryObject['$and'] = [
                    {'dateByMonth': {'$gte': startDateByWeek}},
                    {'dateByMonth': {'$lte': endDateByWeek}},
                    {'project._id': {'$in': projectIds}},
                    {'isPaid': false}
                ];

                WTrack.aggregate([
                    {
                        $match: queryObject
                    }, {
                        $group: {
                            _id: {
                                name: '$project.projectName',
                                _id: '$project._id',
                                dateByMonth: '$dateByMonth'
                            },
                            ids: {$addToSet:'$project._id'},
                            revenue: {$sum: {$subtract: ['$revenue', '$cost']}}
                        }
                    }, {
                        $project: {
                            projectName: '$_id.name',
                            _id: '$_id._id',
                            dateByMonth: '$_id.dateByMonth',
                            revenue: 1
                        }
                    }, {
                        $group: {
                            _id: '$dateByMonth',
                            root: {$addToSet: '$$ROOT'}
                        }
                    } , {
                        $sort: {
                            _id: 1
                        }
                    }], function (err, result) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                });
            };

            function getProjectsByIds(wTracks, callback) {
                //var _ids = _.pluck(wTracks, 'project._id');

                Project.aggregate([
                    {
                        $match: {
                            _id: {'$in': projectIds}
                        }
                    },
                    {
                        $unwind: '$bonus'
                    },
                    {
                        $group: {
                            _id: {
                                employeeId: '$bonus.employeeId',
                                bonusId: '$bonus.bonusId'
                            },
                            projects: {
                                $addToSet: {
                                    _id: '$_id',
                                    name: '$projectName'
                                }
                            }

                        }
                    }, {
                        $project: {
                            employee: '$_id.employeeId',
                            bonus: '$_id.bonusId',
                            projects: 1,
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: '$employee',
                            root: {$push: '$$ROOT'}
                        }
                    }
                ], function (err, projects) {
                    if (err) {
                        return callback(err)
                    }

                    Employee.populate(projects, {
                        path: '_id',
                        match: {'department._id': '55b92ace21e4b7c40f000014'},
                        select: '_id name',
                        options: {
                            lean: true
                        }
                    }, function(err, employees){
                        if(err){
                            return callback(err);

                        }

                        projects = _.filter(projects, function(employee){
                            if(employee._id){
                                return employee;
                            }
                        });

                        BonusType.populate(projects, {
                            path: 'root.bonus',
                            select: '_id name value',
                            options: {
                                lean: true
                            }
                        }, function(err, types){
                            if(err){
                                return callback(err);

                            }

                            callback(null, {wTracks: wTracks, projects: projects});
                        });
                    });

                });
            };

            function getBonuses(wTracks, callback) {
                var _ids = _.pluck(wTracks, 'project._id');

                Project.aggregate([
                    {
                        $match: {
                            _id: {'$in': _ids}
                        }
                    },
                    {
                        $unwind: '$bonus'
                    },
                    {
                        $group: {
                            _id: {employeeId: '$bonus.employeeId', bonusId: '$bonus.bonusId'},
                            dateArray: {
                                $push: {
                                    startDate: '$bonus.startDate',
                                    endDate: '$bonus.endDate',
                                    projectId: '$_id'
                                }
                            }

                        }
                    }
                ], callback);
            };


            if (!access) {
                return res.status(403).send();
            }

            waterfallTasks = [idForProjects, getWTracksByProjects, getProjectsByIds];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                result = resultGenerator(result);

                res.status(200).send(result);
            });

            function resultGenerator(projectsWetrackObject){
                var employees = [];
                var groupedEmployees = projectsWetrackObject.projects;
                var groupedWtracks = projectsWetrackObject.wTracks;
                var employee;
                var _employee;
                var dateStr;
                var groupedEmployee;
                var totalByBonus;
                var bonusObject;

                //iterate over grouped result of projects with bonus by Employee
                for(var i = groupedEmployees.length; i--;){
                    totalByBonus = 0;

                    groupedEmployee = groupedEmployees[i];
                    _employee = groupedEmployee._id;
                    employee = {
                        _id: _employee._id,
                        name: _employee.name.first + ' ' + _employee.name.last,
                        total: 0
                    };
                    //iterate over grouped result of wTrack by date and projects
                    for(var j = groupedWtracks.length; j--;){
                        dateStr = groupedWtracks[j]._id;
                        /*employee[dateStr] = [];*/
                        bonusObject = {
                            total: 0
                        };
                        for(var m  = groupedEmployee.root.length; m--; ){
                            /*bonusObject = {
                             total: 0
                             };*/
                            totalByBonus = 0;

                            for(var k = groupedWtracks[j].root.length; k--;) {

                                for (var l = groupedEmployee.root[m].projects.length; l--;){
                                    if (groupedWtracks[j].root[k]._id.toString() === groupedEmployee.root[m].projects[l]._id.toString()) {
                                        totalByBonus += (groupedEmployee.root[m].bonus.value * groupedWtracks[j].root[k].revenue / 100) / 100;
                                    }
                                }

                            }
                            bonusObject[groupedEmployee.root[m].bonus.name] = totalByBonus;
                            bonusObject.total += totalByBonus;
                            bonusObject.total = parseFloat(bonusObject.total.toFixed(2));
                            /*employee[dateStr].push(bonusObject);*/
                        }
                        employee.total += bonusObject.total;
                        employee.total = parseFloat(employee.total.toFixed(2));
                        employee[dateStr] = bonusObject;
                    }

                    employees.push(employee);
                }

                return employees;
            }

        });
    };

    this.calcBonus = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var BonusType = models.get(req.session.lastDb, 'bonusType', BonusTypeSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDateByWeek;
            var startDate;
            var endDateByWeek;
            var endDate;
            var waterfallTasks;
            var projectIds;

            var startMomentDate = moment().isoWeekYear(startYear).month(startMonth - 1);
            var endMomentDate = moment().isoWeekYear(endYear).month(endMonth - 1);

            var startWeek = startMomentDate.isoWeek();
            var endWeek = endMomentDate.isoWeek();

            startDate = startMomentDate.date(1).toDate();
            endDate = endMomentDate.date(31).toDate();

            startDateByWeek = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDateByWeek = parseInt(options.endDate) || (endYear * 100 + endMonth);

            var idForProjects = function (callback) {
                Project.aggregate([{
                    $project: {
                        _id: 1,
                        bonus: 1,
                        bonusCount: {$size: '$bonus'}
                    }
                }, {
                    $match: {
                        $and: [{
                            bonusCount: {$gt: 0}
                        }, {
                            $or: [{
                                $or: [{
                                    'bonus.startDate': null
                                }, {
                                    'bonus.endDate': null
                                }]
                            }, {
                                $or: [{
                                    'bonus.startDate': {$gte: startDate}
                                }, {
                                    'bonus.endDate': {$lte: endDate}
                                }]
                            }]
                        }]
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                }], function (err, response) {
                    if (err) {
                        return callback(err);
                    }

                    response = _.pluck(response, '_id');

                    callback(null, response);
                });
            };

            function getWTracksByProjects(_ids, callback) {
                var queryObject = {};

                projectIds = _ids;

                queryObject['$and'] = [
                    {'dateByMonth': {'$gte': startDateByWeek}},
                    {'dateByMonth': {'$lte': endDateByWeek}},
                    {'project._id': {'$in': projectIds}},
                    {'isPaid': true}
                ];

                WTrack.aggregate([
                    {
                        $match: queryObject
                    }, {
                        $group: {
                            _id: {
                                name: '$project.projectName',
                                _id: '$project._id',
                                dateByMonth: '$dateByMonth'
                            },
                            ids: {$addToSet:'$project._id'},
                            revenue: {$sum: {$subtract: ['$revenue', '$cost']}}
                        }
                    }, {
                        $project: {
                            projectName: '$_id.name',
                            _id: '$_id._id',
                            dateByMonth: '$_id.dateByMonth',
                            revenue: 1
                        }
                    }, {
                        $group: {
                            _id: '$dateByMonth',
                            root: {$addToSet: '$$ROOT'}
                        }
                    } , {
                        $sort: {
                            _id: 1
                        }
                    }], function (err, result) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                });
            };

            function getProjectsByIds(wTracks, callback) {
                //var _ids = _.pluck(wTracks, 'project._id');

                Project.aggregate([
                    {
                        $match: {
                            _id: {'$in': projectIds}
                        }
                    },
                    {
                        $unwind: '$bonus'
                    },
                    {
                        $group: {
                            _id: {
                                employeeId: '$bonus.employeeId',
                                bonusId: '$bonus.bonusId'
                            },
                            projects: {
                                $addToSet: {
                                    _id: '$_id',
                                    name: '$projectName'
                                }
                            }

                        }
                    }, {
                        $project: {
                            employee: '$_id.employeeId',
                            bonus: '$_id.bonusId',
                            projects: 1,
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: '$employee',
                            root: {$push: '$$ROOT'}
                        }
                    }
                ], function (err, projects) {
                    if (err) {
                        return callback(err)
                    }

                    Employee.populate(projects, {
                        path: '_id',
                        match: {'department._id': '55b92ace21e4b7c40f000014'},
                        select: '_id name',
                        options: {
                            lean: true
                        }
                    }, function(err, employees){
                        if(err){
                            return callback(err);

                        }

                        projects = _.filter(projects, function(employee){
                            if(employee._id){
                                return employee;
                            }
                        });

                        BonusType.populate(projects, {
                            path: 'root.bonus',
                            select: '_id name value',
                            options: {
                                lean: true
                            }
                        }, function(err, types){
                            if(err){
                                return callback(err);

                            }

                            callback(null, {wTracks: wTracks, projects: projects});
                        });
                    });

                });
            };

            function getBonuses(wTracks, callback) {
                var _ids = _.pluck(wTracks, 'project._id');

                Project.aggregate([
                    {
                        $match: {
                            _id: {'$in': _ids}
                        }
                    },
                    {
                        $unwind: '$bonus'
                    },
                    {
                        $group: {
                            _id: {employeeId: '$bonus.employeeId', bonusId: '$bonus.bonusId'},
                            dateArray: {
                                $push: {
                                    startDate: '$bonus.startDate',
                                    endDate: '$bonus.endDate',
                                    projectId: '$_id'
                                }
                            }

                        }
                    }
                ], callback);
            };


            if (!access) {
                return res.status(403).send();
            }

            waterfallTasks = [idForProjects, getWTracksByProjects, getProjectsByIds];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                result = resultGenerator(result);

                res.status(200).send(result);
            });

            function resultGenerator(projectsWetrackObject){
                var employees = [];
                var groupedEmployees = projectsWetrackObject.projects;
                var groupedWtracks = projectsWetrackObject.wTracks;
                var employee;
                var _employee;
                var dateStr;
                var groupedEmployee;
                var totalByBonus;
                var bonusObject;

                //iterate over grouped result of projects with bonus by Employee
                for(var i = groupedEmployees.length; i--;){
                    totalByBonus = 0;

                    groupedEmployee = groupedEmployees[i];
                    _employee = groupedEmployee._id;
                    employee = {
                        _id: _employee._id,
                        name: _employee.name.first + ' ' + _employee.name.last,
                        total: 0
                    };
                    //iterate over grouped result of wTrack by date and projects
                    for(var j = groupedWtracks.length; j--;){
                        dateStr = groupedWtracks[j]._id;
                        /*employee[dateStr] = [];*/
                        bonusObject = {
                            total: 0
                        };
                        for(var m  = groupedEmployee.root.length; m--; ){
                            /*bonusObject = {
                             total: 0
                             };*/
                            totalByBonus = 0;

                            for(var k = groupedWtracks[j].root.length; k--;) {

                                for (var l = groupedEmployee.root[m].projects.length; l--;){
                                    if (groupedWtracks[j].root[k]._id.toString() === groupedEmployee.root[m].projects[l]._id.toString()) {
                                        totalByBonus += (groupedEmployee.root[m].bonus.value * groupedWtracks[j].root[k].revenue / 100) / 100;
                                    }
                                }

                            }
                            bonusObject[groupedEmployee.root[m].bonus.name] = totalByBonus;
                            bonusObject.total += totalByBonus;
                            bonusObject.total = parseFloat(bonusObject.total.toFixed(2));
                            /*employee[dateStr].push(bonusObject);*/
                        }
                        employee.total += bonusObject.total;
                        employee.total = parseFloat(employee.total.toFixed(2));
                        employee[dateStr] = bonusObject;
                    }

                    employees.push(employee);
                }

                return employees;
            }

        });
    };


    this.totalHours = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var MonthHours = models.get(req.session.lastDb, 'MonthHours', monthHoursSchema);
        var Vacation = models.get(req.session.lastDb, 'Vacation', vacationSchema);
        var Holidays = models.get(req.session.lastDb, 'Holiday', holidaysSchema);
        var Employees = models.get(req.session.lastDb, 'Employees', employeeSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startWeek = parseInt(options.week);
            var startYear = parseInt(options.year);
            var startMonth = moment().year(startYear).isoWeek(startWeek).month();
            var endMonth;
            var endWeek;
            var endYear;
            var startDate;
            var endDate;
            var match;
            var matchHoliday;
            var matchVacation;
            var groupBy;
            var parallelTasksObject;
            var waterfallTasks;

            if (!access) {
                return res.status(403).send();
            }

            if (startWeek >= 40) {
                endWeek = parseInt(startWeek) + 14 - 53;
                endYear = parseInt(startYear) + 1;
            } else {
                endWeek = parseInt(startWeek) + 14;
                endYear = parseInt(startYear);
            }

            startDate = startYear * 100 + startWeek;
            endDate = endYear * 100 + endWeek;

            endMonth = moment().year(endYear).isoWeek(endWeek).month();

            groupBy = {
                _id: '$department.name',
                root: {
                    $push: '$$ROOT'
                }
            };

            function employeesRetriver(waterfallCb) {
                Employees
                    .find(
                    {isEmployee: true},
                    {_id: 1}
                )
                    .lean()
                    .exec(function(err, result){
                        if (err){
                            waterfallCb(err);
                        }
                        var Ids = [];
                        result.forEach(function(element){
                            Ids.push(element._id);
                        });

                        waterfallCb(null, Ids);
                    })
            };

            waterfallTasks = [
                employeesRetriver,
                parallel
            ];


            function parallel (ids, waterfallCb){
                match = {
                    month: {$gte: startMonth, $lte: endMonth},
                    year: {$gte: startYear, $lte: endYear}
                };

                matchVacation = {
                    month: {$gte: startMonth, $lte: endMonth},
                    year: {$gte: startYear, $lte: endYear},
                    'employee._id': {$in: ids}
                };

                matchHoliday = {
                    week: {$gte: startWeek, $lte: endWeek},
                    year: {$gte: startYear, $lte: endYear}
                };

                parallelTasksObject = {
                    monthHours: monthHourRetriver,
                    holidays: holidaysRetriver,
                    vacations: vacationComposer,
                    wTracks: wTrackComposer
                };

                function monthHourRetriver( parallelCb) {
                    MonthHours
                        .find(
                        match,
                        {year:1, month: 1, hours: 1}
                    )
                        .lean()
                        .exec(parallelCb)
                };

                function holidaysRetriver( parallelCb) {
                    Holidays
                        .find(matchHoliday)
                        .lean()
                        .exec(parallelCb)
                };
                function vacationComposer(parallelCb) {
                    Vacation.aggregate([{
                        $match: matchVacation
                    },
                        {
                            $group: {
                                _id: {
                                    _id: '$employee._id',
                                    name: '$employee.name',
                                    month: '$month',
                                    monthTotal: '$monthTotal'
                                },
                            }
                        }, {
                            $project: {
                                employee: '$_id._id',
                                name: '$_id.name',
                                month: '$_id.month',
                                monthTotal: '$_id.monthTotal'
                            }
                        },
                        {
                            $sort: {_id: 1}
                        }
                    ], function (err, response) {
                        if (err) {
                            return next(err);
                        }

                        parallelCb(null, response);
                    });
                };
                function wTrackComposer(parallelCb) {
                    match = {
                        month: {$gte: startMonth, $lte: endMonth},
                        year: {$gte: startYear, $lte: endYear},
                        'employee._id': {$in: ids}
                    };

                    groupBy = {
                        _id: {
                            department: '$department.departmentName',
                            _id: '$department._id',
                            year: '$year',
                            month: '$month',
                            employee: '$employee'
                        },
                        sold: {$sum: '$worked'}
                    };

                    WTrack.aggregate([{
                        $match: match
                    }, {
                        $group: groupBy
                    }, {
                        $project: {
                            year: "$_id.year",
                            month: "$_id.month",
                            department: "$_id.department",
                            sold: 1,
                            employee: '$_id.employee'
                        }
                    },
                        {
                            $group: {
                                _id: '$department',
                                root: {$push: '$$ROOT'},
                                totalSold: {$sum: '$sold'}
                            }
                        }, {
                            $sort: {_id: 1}
                        }], function (err, response) {
                        if (err) {
                            return next(err);
                        }
                        parallelCb(null, response);

                    });
                };
                async.parallel(parallelTasksObject, function (err, response) {
                    if (err) {
                        return next(err);
                    }

                    waterfallCb(null, response);
                });
            }

            function waterfallCb(err, response){
                if (err) {
                    return next(err);
                }

                resultMapper(response);

               // res.status(200).send(response);
            }

            function resultMapper (response){
                var holidays = response['holidays'];
                var vacations = response['vacations'];
                var weTracks = response['wTracks'];
                var monthHours = response['monthHours'];
                var result = [];

                weTracks.forEach(function(wTrack){
                    var department = {};
                    var depRoot;
                    var key;

                    department._id = wTrack._id;
                    department.employees = [];
                    depRoot = wTrack.root;

                    depRoot.forEach(function(element){
                        var employee = {};
                        var vacationForEmployee = 0;
                        var hoursForMonth = 0;
                        var holidaysForMonth = 0;

                        employee._id = element.employee._id;
                        employee.name = element.employee.name;

                        vacations.forEach(function(vacation){
                            if (employee._id.toString() === vacation.employee.toString()){
                                vacationForEmployee = vacation.monthTotal;
                            }
                        });

                        monthHours.forEach(function(month){
                            if ((parseInt(element.month) === parseInt(month.month)) && (parseInt(element.year) === parseInt(month.year))){
                                hoursForMonth = month.hours;
                            }
                        });

                        holidays.forEach(function(holiday){
                            var dateMonth = moment(holiday.date).month();
                            if (dateMonth === element.month){
                                holidaysForMonth += 1;
                            }
                        });


                        key = element.year * 100 + element.month;
                        employee.hoursTotal = {};
                        employee.hoursTotal[key] = parseInt(hoursForMonth) - parseInt(vacationForEmployee) * 8 - parseInt(holidaysForMonth) * 8;

                        department.employees.push(employee);
                    });


                    result.push(department);
                });

                res.status(200).send(result);
            }

            async.waterfall(waterfallTasks, waterfallCb);

        });
    };
};

module.exports = wTrack;