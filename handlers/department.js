var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
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
        var query = req.query;
        var matchQuery = {};
        if (query.devDepartments){
            matchQuery.parentDepartment = objectId('56cebdf6541812c07197358f');
        }

        Department
            .find(matchQuery)
            .select('_id departmentName')
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