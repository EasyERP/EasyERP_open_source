

var express = require('express');
var router = express.Router();
var PaymentTermHandler = require('../handlers/paymentTerm');

module.exports = function (models) {
    var handler = new PaymentTermHandler(models);

    router.get('/', handler.getForDd);
    router.get('/getForList', handler.getForList);
    router.put('/:id', handler.update);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);

    return router;
};