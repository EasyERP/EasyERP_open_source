/**
 * Created by Roman on 20.05.2015.
 */
var express = require('express');
var router = express.Router();
var PaymentHandler = require('../handlers/payment');

module.exports = function (models) {
    var handler = new PaymentHandler(models);

    router.post('/', handler.create);

    return router;
};