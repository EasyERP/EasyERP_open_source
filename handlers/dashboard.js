/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var wTrack = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var _ = require('../node_modules/underscore');
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var WorkflowSchema = mongoose.Schemas['workflow'];

    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');

    this.composeForVacation = function (req, res, next) {
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var startDate = 201522;
        var endDate = 201523;

        function employeeFinder(waterfallCb) {
            Employee
                .find({}, {_id: 1})
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
                        dateByWeek: {$gte: startDate, $lte: endDate}
                    }
                }, {
                    $group: {
                        _id: {
                            department: '$department.departmentName',
                            employee: '$employee.name',
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
                        hours: 1,
                        _id: 0
                    }
                }, {
                    $group: {
                        _id: {
                            department: '$department',
                            dateByWeek: '$dateByWeek'
                        },
                        employeeData: {$push: '$$ROOT'}
                    }
                }, {
                    $project: {
                        department: '$_id.department',
                        dateByWeek: '$_id.dateByWeek',
                        employeeData: 1,
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
                        weekData: '$root',
                        _id: 0
                    }
                }], function (err, response) {
                if (err) {
                    return waterfallCb(err);
                }
                waterfallCb(null, response);
            });
        };

        function responsSender(err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        }

        async.waterfall([employeeFinder, wTrackComposer], responsSender);
    };

};

module.exports = wTrack;