/**
 * Created by lilya on 10/11/15.
 */

var mongoose = require('mongoose');
var PaymentTerm = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var PaymentTypeSchema = mongoose.Schemas['PaymentType'];

    this.getForDd = function (req, res, next) {
        var PaymentType = models.get(req.session.lastDb, 'PaymentType', PaymentTypeSchema);

        PaymentType
            .find()
            .sort({name: 1})
            .lean()
            .exec(function (err, types) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(types)
            });
    };

};

module.exports = PaymentTerm;