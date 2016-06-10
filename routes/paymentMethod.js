var express = require('express');
var router = express.Router();
var PaymentMethodHandler = require('../handlers/paymentMethod');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new PaymentMethodHandler(models);
    var moduleId = MODULES.CUSTOMER_PAYMENTS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', handler.getForDd);
    router.get('/getForList', handler.getForList);

    router.put('/:id', handler.update);
    router.post('/', handler.create);

    router.delete('/:id', handler.remove);

    return router;
};
