/**
 * Created by Roman on 21.05.2015.
 */
var mongoose = require('mongoose');
var PaymentMthod = function (models) {
    var access = require("../Modules/additions/access.js")(models);
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