var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var PaymentTermSchema = mongoose.Schemas.PaymentTerm;

    this.getForDd = function (req, res, next) {
        var PaymentTerm = models.get(req.session.lastDb, 'PaymentTerm', PaymentTermSchema);
        var pipelines = [
            {
                $lookup: {
                    from        : 'orgSettings',
                    localField  : '_id',
                    foreignField: 'paymentTerms',
                    as          : 'defaultPaymentTerm'
                }
            },
            {
                $project: {
                    name              : 1,
                    count             : 1,
                    defaultPaymentTerm: {$size: '$defaultPaymentTerm'}
                }
            },
            {
                $sort: {
                    defaultPaymentTerm: -1,
                    name              : 1
                }
            }];

        PaymentTerm.aggregate(pipelines)
            .exec(function (err, terms) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: terms});
            });

        // PaymentTerm
        //     .find()
        //     .sort({name: 1})
        //     .lean()
        //     .exec(function (err, terms) {
        //         if (err) {
        //             return next(err);
        //         }
        //
        //         res.status(200).send({data: terms});
        //     });
    };

    this.getForList = function (req, res, next) {
        var PaymentTerm = models.get(req.session.lastDb, 'PaymentTerm', PaymentTermSchema);

        PaymentTerm
            .find()
            .sort({name: 1})
            .exec(function (err, methods) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(methods);
            });
    };

    this.update = function (req, res, next) {
        var PaymentTerm = models.get(req.session.lastDb, 'PaymentTerm', PaymentTermSchema);
        var body = req.body;
        var id = req.params.id;

        PaymentTerm.findByIdAndUpdate(id, body, {new: true}, function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

    this.create = function (req, res, next) {
        var PaymentTerm = models.get(req.session.lastDb, 'PaymentTerm', PaymentTermSchema);
        var body = req.body;

        var payment = new PaymentTerm(body);

        payment.save(function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

    this.remove = function (req, res, next) {
        var PaymentTerm = models.get(req.session.lastDb, 'PaymentTerm', PaymentTermSchema);
        var id = req.params.id;

        PaymentTerm.findByIdAndRemove(id, function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

};

module.exports = Module;
