
var express = require('express');
var router = express.Router();
var PaymentHandler = require('../handlers/payment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new PaymentHandler(models, event);
    var moduleId = MODULES.CUSTOMER_PAYMENTS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddlware);

    router.get('/', handler.getForView);
    router.get('/:byType/', handler.getForView);

    router.get('/amountLeftCalc', handler.amountLeftCalc);
    router.get('/getForProject', handler.getForProject);
    router.get('/:byType/totalCollectionLength', handler.totalCollectionLength);
    router.post('/', handler.create);
    router.post('/supplier', handler.createPayOut);
    router.post('/salary', handler.salaryPayOut);
    router.delete('/:id', handler.remove);
    router.patch('/:byType', handler.putchBulk);

    return router;
};

/*

* */