var mongoose = require('mongoose');

var PayrollComponentType = function (models) {
    'use strict';
    var PayrollComponentTypesSchema = mongoose.Schemas.payrollComponentType;

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
        var type = req.query.type;

        PayrollComponentType.find({type: type}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getForDd = function (req, res, next) {
        var db = req.session.lastDb;
        var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);

        PayrollComponentType.find({}, {name: 1}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
        var payrollComponentType = new PayrollComponentType(req.body);

        payrollComponentType.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.delete = function (req, res, next) {
        var db = req.session.lastDb;
        var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);

        PayrollComponentType.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
        var id = req.params.id;
        var data = req.body;

        PayrollComponentType.findByIdAndUpdate(id, data, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

};

module.exports = PayrollComponentType;