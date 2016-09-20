var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var PaymentMethodSchema = mongoose.Schemas.PaymentMethod;

    this.getForDd = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);

        PaymentMethod
            .find()
            .sort({name: 1})
            .populate('chartAccount')
            .exec(function (err, methods) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: methods});
            });
    };

    this.getForList = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);

        PaymentMethod
            .find()
            .populate('chartAccount')
            .sort({name: 1})
            .exec(function (err, methods) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(methods);
            });
    };

    this.update = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
        var body = req.body;
        var id = req.params.id;

        PaymentMethod.findByIdAndUpdate(id, body, {new : true}, function (err, method) {
            if (err) {
                return next(err);
            }
            method.populate('chartAccount', function (err, method){
                if (err) {
                    return next(err);
                }
                res.status(200).send(method);
            });


        });
    };

    this.create = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
        var body = req.body;

        var payment = new PaymentMethod(body);

        payment.save(function (err, method) {
            if (err) {
                return next(err);
            }
            method.populate('chartAccount', function (err, method){
                if (err) {
                    return next(err);
                }
                res.status(200).send(method);
            });
        });
    };

    this.remove = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
        var id = req.params.id;

        PaymentMethod.findByIdAndRemove(id, function (err, method) {
            if (err) {
                return next(err);
            }
            res.status(200).send(method);
        });
    };

};

module.exports = Module;
