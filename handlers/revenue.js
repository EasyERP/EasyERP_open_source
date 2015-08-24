/**
 * Created by Roman on 04.05.2015.
 */
var async = require('async');
var _ = require('lodash');
var mongoose = require('mongoose');

var moment = require('../public/js/libs/moment/moment');

var wTrack = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var BonusTypeSchema = mongoose.Schemas['bonusType'];

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
        var BonusType = models.get(req.session.lastDb, 'bonusType', BonusTypeSchema);

        access.getReadAccess(req, req.session.uId, 67, function (access) {
            var options = req.query;
            var startMonth = parseInt(options.month) || 8;
            var startYear = parseInt(options.year) || 2014;
            var endMonth = parseInt(options.endMonth) || 7;
            var endYear = parseInt(options.endYear) || 2015;
            var startDate;
            var endDate;
            var waterfallTasks;

            var startWeek = moment().isoWeekYear(startYear).month(startMonth - 1).isoWeek();
            var endWeek = moment().isoWeekYear(endYear).month(endMonth - 1).isoWeek();

            startDate = parseInt(options.startDate) || (startYear * 100 + startMonth);
            endDate = parseInt(options.endDate) || (endYear * 100 + endMonth);

            console.log(startWeek, startYear, endWeek, endYear);

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
                            bonusCount: {$gt: 0}}, {
                            $or: [{
                                $or: [{
                                    'bonus.startDate': null
                                }, {
                                    'bonus.endDate': null
                                }]
                            }, {
                                $or: [{
                                    'bonus.startWeek': {$gte: startWeek},
                                    'bonus.startYear': {$gte: startWeek}
                                }, {
                                    'bonus.endWeek': {$lte: endWeek},
                                    'bonus.endYear': {$lte: endWeek}
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

                queryObject['$and'] = [
                    {'dateByMonth': {'$gte': startDate}},
                    {'dateByMonth': {'$lte': endDate}},
                    {'project._id': {'$in': _ids}}
                ];

                WTrack.find(queryObject)
                    .lean()
                    .exec(function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, result);
                    })
            };

            function getProjectsByIds(wTracks, callback) {
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

            waterfallTasks = [idForProjects/*, getWTracksByProjects, getProjectsByIds*/];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                //result = _.sortBy(result, '_id.employeeId');

                res.status(200).send(result);
            });

        });
    };
};

module.exports = wTrack;