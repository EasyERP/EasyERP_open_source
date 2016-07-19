var express = require('express');
var router = express.Router();
var PaymentTypeHandler = require('../handlers/paymentType');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PaymentTypeHandler(models);

    router.use(authStackMiddleware);
    
    router.get('/', handler.getForDd);

    return router;
};
