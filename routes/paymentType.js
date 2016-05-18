/**
 * Created by lilya on 10/11/15.
 */


var express = require('express');
var router = express.Router();
var PaymentTypeHandler = require('../handlers/paymentType');

module.exports = function (models) {
    var handler = new PaymentTypeHandler(models);

    router.get('/', handler.getForDd);

    return router;
};