/**
 * Created by Roman on 21.05.2015.
 */
var mongoose = require('mongoose');
var async = require('async');

var Employee = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var objectId = mongoose.Types.ObjectId;
    var _ = require('../node_modules/underscore');

    this.getForDD = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .find()
            .select('_id name department')
            .populate('department', '_id departmentName')
            .sort({'name.first': 1})
            .lean()
            .exec(function (err, employees) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: employees})
            });
    };

    this.getBySales = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        function assigneFinder(cb) {
            var match = {
                projectmanager: {$ne: null}
            };

            Project.aggregate([{
                $match: match
            }, {
                $group: {
                    _id: "$projectmanager"
                }
            }], cb);
        };

        function employeeFinder(assignedArr, cb) {
            Employee
                .find({_id: {$in: assignedArr}})
                .select('_id name')
                .sort({'name.first': 1, 'name.last': 1})
                .lean()
                .exec(cb);
        }

        async.waterfall([assigneFinder, employeeFinder], function (err, employees) {
            if (err) {
                return next(err);
            }

            res.status(200).send(employees);
        });

    };

    this.byDepartment = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .aggregate([{
                $match: {isEmployee: true}
            }, {
                $group: {
                    _id: "$department",
                    employees: {$push: {
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
                    return next(err);
                }

                res.status(200).send(employees);
            });
    };

    this.getFilterValues = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employee', EmployeeSchema);

        Employee
            .aggregate([
                {
                    $group: {
                        _id: null,
                        'Name': {
                            $addToSet: '$name.last'
                        },
                        'Email': {
                            $addToSet: '$workEmail'
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                _.map(result[0], function(value, key) {
                    switch (key) {
                        case 'Name':
                            result[0][key] = _.sortBy(value, function (num) { return num});
                            break;
                        case  'Email':
                            result[0][key] = _.sortBy(value, function (num) { return num});
                            break;

                    }
                });

                res.status(200).send(result);
            });
    };

};

module.exports = Employee;