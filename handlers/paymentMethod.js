var mongoose = require('mongoose');
var PaymentMthod = function (models) {
    'use strict';

    var PaymentMethodSchema = mongoose.Schemas['PaymentMethod'];

    this.getForDd = function (req, res, next) {
        var PaymentMethod = models.get(req.session.lastDb, 'PaymentMethod', PaymentMethodSchema);

        PaymentMethod
            .find()
            .sort({name: 1})
            .exec(function (err, terms) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: terms})
            });
    };

};

module.exports = PaymentMthod;