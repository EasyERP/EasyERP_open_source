/**
 * Created by Roman on 13.05.2015.
 */

var express = require('express');
var router = express.Router();
var PaymentTermHandler = require('../handlers/paymentTerm');

module.exports = function (models) {
    var handler = new PaymentTermHandler(models);

    router.get('/', handler.getForDd);

    return router;
};