var mongoose = require('mongoose');
var Department = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var DepartmentSchema = mongoose.Schemas['Department'];

    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Department;

    exportDecorator.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'Department', DepartmentSchema)
    }, exportMap, "Department");

    this.getForDD = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

        Department
            .find()
            .select('_id departmentName departmentManager')
            .sort({departmentName: 1})
            .lean()
            .exec(function (err, departments) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: departments})
            });
    };
};

module.exports = Department;