/**
 * Created by Roman on 04.05.2015.
 */

/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var Payment = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    var PaymentSchema = mongoose.Schemas['Payment'];

    this.create = function (req, res, next) {
        var body = req.body;
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var payment = new Payment(body);

        payment.save();
    };
};

module.exports = Payment;