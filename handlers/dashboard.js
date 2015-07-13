/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var wTrack = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var _ = require('lodash');
    var moment = require('../public/js/libs/moment/moment');
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var objectId = mongoose.Types.ObjectId;
    var DepartmentSchema = mongoose.Schemas['Department'];
    var EmployeeSchema = mongoose.Schemas['Employee'];

    var async = require('async');

    this.composeForVacation = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        /*var startDate = 201522;
        var endDate = 201535;*/
        var weeksArr;
        var week;
        var startDate /*= 201522*/;
        var endDate /*= 201535*/;

        var currentWeek = moment().week();
        var currentStartWeek = currentWeek - 6;
        var currentYear = moment().weekYear();

        weeksArr = [];
        startDate = currentYear * 100 + currentStartWeek;

        for (var i = 0; i <= 13; i++) {
            if (currentStartWeek + i > 53) {
                week = currentStartWeek + i - 53;
                weeksArr.push({
                    dateByWeek: (currentYear + 1) * 100 + week
                });
            } else {
                week = currentStartWeek + i;
                weeksArr.push({
                    dateByWeek: (currentYear) * 100 + week
                });
            }
        }

        weeksArr = _.sortBy(weeksArr, function (monthObject) {
            return monthObject.dateByWeek
        });
        endDate = weeksArr[weeksArr.length - 1].dateByWeek;

        function resultMapper(err, result){
            var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
            var employeesByDep;
            var dashBoardResult;

            if(err){
                return next(err);
            }

            employeesByDep = result[0];
            dashBoardResult = result[1];

            employeesByDep = _.map(employeesByDep, function(employee){
                var dashDepartment = _.find(dashBoardResult, function(deps){
                    return deps.department.toString() === employee.department.toString();
                });

                employee.employees = _.map(employee.employees, function(_employee){
                    var dashResultByEmployee;

                    if (dashDepartment) {
                        dashResultByEmployee = _.find(dashDepartment.employeeData, function (employeeData) {
                            return employeeData.employee.toString() === _employee._id.toString();
                        });
                        _employee.weekData = dashResultByEmployee ? _.map(weeksArr, function (weekData) {
                            var data = _.find(dashResultByEmployee.weekData, function (d) {
                               return parseInt(d.dateByWeek) === parseInt(weekData.dateByWeek);
                            });
                            if (data) {
                                weekData = data;
                            }
                            return weekData;
                        }) : weeksArr;
                    } else {
                        _employee.weekData = weeksArr;
                    }

                    _employee.maxProjects = dashResultByEmployee ? dashResultByEmployee.maxProjects : 0

                    return _employee;
                });

                return employee
            });

            Department.populate(employeesByDep, {path: 'department', select: 'departmentName _id'}, function(err, resp){
                res.status(200).send(employeesByDep);
            });
        };

        function employeeByDepComposer(parallelCb){
            var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

            Employee
                .aggregate([{
                    $match: {
                        isEmployee: true,
                        department: {$nin: [objectId("559fcf0b8ed45e781b000013"), objectId("559fcf0b8ed45e781b000014")]}
                    }
                }, {
                    $group: {
                        _id: "$department",
                        employees: {$push: {
                            isLead: '$isLead',
                            name: {$concat: ['$name.first', ' ', '$name.last']},
                            _id: '$_id'
                        }}
                    }
                }, {
                    $project: {
                        department: '$_id',
                        employees: 1,
                        _id: 0
                    }
                }], function (err, employees) {
                    if(err){
                        return parallelCb(err);
                    }

                    parallelCb(null, employees);
                });
        };

        function dashComposer(parallelCb) {
            function employeeFinder(waterfallCb) {
                var query = {isEmployee: true};
                var projection = {_id: 1};

                Employee
                    .find(query, projection)
                    .lean()
                    .exec(function (err, employees) {
                        if (err) {
                            return waterfallCb(err);
                        }

                        employees = _.pluck(employees, '_id');
                        waterfallCb(null, employees);
                    });
            };

            function wTrackComposer(employeesArray, waterfallCb) {
                WTrack.aggregate([
                    {
                        $match: {
                            'employee._id': {$in: employeesArray},
                            dateByWeek: {$gte: startDate, $lte: endDate},
                            'department._id': {$nin: [objectId("559fcf0b8ed45e781b000013"), objectId("559fcf0b8ed45e781b000014")]}
                        }
                    }, {
                        $group: {
                            _id: {
                                department: '$department._id',
                                employee: '$employee._id',
                                dateByWeek: '$dateByWeek',
                                project: '$project.projectName'
                            },
                            hours: {$sum: '$worked'}
                        }
                    }, {
                        $project: {
                            department: '$_id.department',
                            employee: '$_id.employee',
                            dateByWeek: '$_id.dateByWeek',
                            project: '$_id.project',
                            hours: 1,
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: {
                                department: '$department',
                                employee: '$employee',
                                dateByWeek: '$dateByWeek'
                            },
                            projectRoot: {$push: '$$ROOT'},
                            hours: {$sum: '$hours'}
                        }
                    }, {
                        $project: {
                            department: '$_id.department',
                            employee: '$_id.employee',
                            dateByWeek: '$_id.dateByWeek',
                            projectRoot: 1,
                            projects: {$size: '$projectRoot'},
                            hours: 1,
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: {
                                department: '$department',
                                employee: '$employee'
                            },
                            maxProjects: {$max: '$projects'},
                            weekData: {$push: '$$ROOT'}
                        }
                    }, {
                        $project: {
                            department: '$_id.department',
                            employee: '$_id.employee',
                            weekData: 1,
                            maxProjects: 1,
                            _id: 0
                        }
                    }, {
                        $group: {
                            _id: {
                                department: '$department'
                            },
                            root: {$push: '$$ROOT'}
                        }
                    }, {
                        $project: {
                            department: '$_id.department',
                            employeeData: '$root',
                            _id: 0
                        }
                    }], function (err, response) {
                    if (err) {
                        return waterfallCb(err);
                    }
                    waterfallCb(null, response);
                });
            };

            function masterWaterfallCb(err, result) {
                if (err) {
                    return parallelCb(err);
                }

                parallelCb(null, result);
            }

            async.waterfall([employeeFinder, wTrackComposer], masterWaterfallCb);
        };

        async.parallel([employeeByDepComposer, dashComposer], resultMapper);
    };

};

module.exports = wTrack;