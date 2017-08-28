var mongoose = require('mongoose');

var Module = function (models, event) {
    'use strict';

    var PaymentMethodSchema = mongoose.Schemas.PaymentMethod;
    var OrderService = require('../services/order')(models);
    var redisClient = require('../helpers/redisClient');
    var objectId = mongoose.Types.ObjectId;
    var integrationStatsHelper = require('../helpers/integrationStatsComposer')(models);

    this.getForDd = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);
        var pipelines = [
            {
                $lookup: {
                    from        : 'chartOfAccount',
                    localField  : 'chartAccount',
                    foreignField: '_id',
                    as          : 'chartAccount'
                }
            },
            {
                $lookup: {
                    from        : 'orgSettings',
                    localField  : '_id',
                    foreignField: 'bankAccount',
                    as          : 'defaultPaymentMethod'
                }
            },
            {
                $project: {
                    _id                 : 1,
                    name                : 1,
                    account             : 1,
                    chartAccount        : {$arrayElemAt: ['$chartAccount', 0]},
                    currency            : 1,
                    bank                : 1,
                    owner               : 1,
                    fullName            : 1,
                    address             : 1,
                    swiftCode           : 1,
                    defaultPaymentMethod: {$size: '$defaultPaymentMethod'}
                }
            },
            {
                $sort: {
                    defaultPaymentMethod: -1,
                    _id                 : -1
                }
            }
        ];

        PaymentMethod.aggregate(pipelines)
            .exec(function (err, methods) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: methods});
            });

        // PaymentMethod
        //     .find()
        //     .sort({_id: -1})
        //     .populate('chartAccount')
        //     .exec(function (err, methods) {
        //         if (err) {
        //             return next(err);
        //         }
        //
        //         res.status(200).send({data: methods});
        //     });
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

                        integrationStatsHelper(dbName, function (err, stats) {
                            if (err) {
                                return next(err);
                            }

                            event.emit('recollectedStats', {dbName: dbName, stats: stats});
                            redisClient.writeToStorage('syncStats', dbName, JSON.stringify(stats));

                            res.status(200).send(method);
                        });
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
