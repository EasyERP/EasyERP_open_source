var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var payrollStructureTypesSchema = mongoose.Schemas.payrollStructureTypes;

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;

        var payrollStructureTypes = models.get(db, 'payrollStructureTypes', payrollStructureTypesSchema);

        payrollStructureTypes.find({}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getById = function (req, res, next) {
        var db = req.session.lastDb;
        var payrollStructureTypes = models.get(db, 'payrollStructureTypes', payrollStructureTypesSchema);
        var id = req.params.id;

        payrollStructureTypes.findById(id).populate('earnings').populate('deductions').exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getForDd = function (req, res, next) {
        var db = req.session.lastDb;
        var payrollStructureTypes = models.get(db, 'payrollStructureTypes', payrollStructureTypesSchema);

        payrollStructureTypes.find({}, {name: 1}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var PayrollStructureTypes = models.get(db, 'payrollStructureTypes', payrollStructureTypesSchema);
        var payrollStructureTypes;

        payrollStructureTypes = new PayrollStructureTypes(req.body);
        payrollStructureTypes.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.delete = function (req, res, next) {
        var db = req.session.lastDb;
        var payrollStructureTypes = models.get(db, 'payrollStructureTypes', payrollStructureTypesSchema);
        var id = req.params.id;

        payrollStructureTypes.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var payrollStructureTypes = models.get(db, 'payrollStructureTypes', payrollStructureTypesSchema);
        var id = req.params.id;
        var data = req.body;

        payrollStructureTypes.findByIdAndUpdate(id, data, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

};

module.exports = Module;
