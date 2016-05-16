
var express = require('express');
var router = express.Router();
var PaymentMethodHandler = require('../handlers/paymentMethod');

module.exports = function (models) {
    var handler = new PaymentMethodHandler(models);

    router.get('/', handler.getForDd);
    router.get('/getForList', handler.getForList);
    router.put('/:id', handler.update);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);

    return router;
};