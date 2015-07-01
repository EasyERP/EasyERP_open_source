/**
 * Created by Roman on 21.05.2015.
 */
var express = require('express');
var router = express.Router();
var PaymentMethodHandler = require('../handlers/paymentMethod');

module.exports = function (models) {
    var handler = new PaymentMethodHandler(models);

    router.get('/', handler.getForDd);

    return router;
};