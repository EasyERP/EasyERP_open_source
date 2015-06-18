/**
 * Created by Roman on 21.05.2015.
 */
var mongoose = require('mongoose');
var async = require('async');

var Employee = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var ProjectSchema = mongoose.Schemas['Project'];

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

        function assigneFinder(){
            var match = {
                projectmanager: {$ne: null}
            };

            var projection = {
                projectmanager: 1
            };

            Project.aggregate([{
                $match: match
            }, {
                $group: {
                    _id: "$projectmanager"
                }
            }])
        };

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

};

module.exports = Employee;