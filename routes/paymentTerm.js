var express = require('express');
var router = express.Router();
var PaymentTermHandler = require('../handlers/paymentTerm');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PaymentTermHandler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getForDd);
    router.get('/getForList', handler.getForList);
    router.put('/:id', handler.update);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);

    return router;
};