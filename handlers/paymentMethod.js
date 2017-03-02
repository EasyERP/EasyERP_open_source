var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';

    var PaymentMethodSchema = mongoose.Schemas.PaymentMethod;
    var OrderService = require('../services/order')(models);

    this.getForDd = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);

        PaymentMethod
            .find()
            .sort({_id: -1})
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
            .sort({_id: -1})
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

        PaymentMethod.findByIdAndUpdate(id, body, {new: true}, function (err, method) {
            if (err) {
                return next(err);
            }
            method.populate('chartAccount', function (err, method) {
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
        var fixOrders = false;
        var dbName = req.session.lastDb;
        var payment;

        if (body.fixOrders) {
            fixOrders = body.fixOrders;
        }

        payment = new PaymentMethod(body);

        payment.save(function (err, method) {
            if (err) {
                return next(err);
            }
            method.populate('chartAccount', function (err, method) {
                if (err) {
                    return next(err);
                }

                if (fixOrders) {
                    OrderService.fixOrder({
                        dbName: dbName,
                        field : 'paymentMethod',
                        name  : method.name,
                        id    : method._id
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(method);
                    });
                } else {
                    res.status(200).send(method);
                }
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
