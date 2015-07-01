/**
 * Created by Roman on 13.05.2015.
 */
var mongoose = require('mongoose');
var PaymentTerm = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var PaymentTermSchema = mongoose.Schemas['PaymentTerm'];

    this.getForDd = function (req, res, next) {
        var PaymentTerm = models.get(req.session.lastDb, 'PaymentTerm', PaymentTermSchema);

        PaymentTerm
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

module.exports = PaymentTerm;