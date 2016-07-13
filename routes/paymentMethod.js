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

    /**
     *@api {get} /payment/ Request PaymentMethods
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentMethods
     * @apiGroup PaymentMethod
     *
     * @apiSuccess {Object} PaymentMethods
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
            "data": [
                {
                    "_id": "565f2e05ab70d49024242e10",
                    "name": "CASH UAH",
                    "account": "CASH UAH",
                    "currency": "UAH",
                    "bank": "",
                    "owner": "CASH UAH"
                },
                {
                    "_id": "565f2e05ab70d49024242e0f",
                    "name": "CASH USD",
                    "account": "CASH USD",
                    "currency": "USD",
                    "bank": "",
                    "owner": "CASH USD"
                },
                ...
            ]
        }
     */
    router.get('/', handler.getForDd);

    /**
     *@api {get} /payment/getForList Request PaymentMethodsForList
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentMethodsForList
     * @apiGroup PaymentMethod
     *
     * @apiSuccess {Object} PaymentMethodsForList
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
             {
                 "_id": "565f2e05ab70d49024242e10",
                 "name": "CASH UAH",
                 "account": "CASH UAH",
                 "currency": "UAH",
                 "bank": "",
                 "owner": "CASH UAH"
             },
             ...
     ]
     */
    router.get('/getForList', handler.getForList);

    router.put('/:id', accessStackMiddleware, handler.update);
    router.post('/', accessStackMiddleware, handler.create);

    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
