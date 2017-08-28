var express = require('express');
var router = express.Router();
var PaymentMethodHandler = require('../handlers/paymentMethod');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new PaymentMethodHandler(models, event);
    var moduleId = MODULES.CUSTOMER_PAYMENTS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /paymentMethod/ Request PaymentMethods
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentMethods
     * @apiGroup Payment Method
     *
     * @apiSuccess {Object} PaymentMethods
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
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
     *@api {get} /paymentMethod/getForList Request PaymentMethodsForList
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentMethodsForList
     * @apiGroup Payment Method
     *
     * @apiSuccess {Object} PaymentMethodsForList
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
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

    /**
     *@api {put} /paymentMethod/:id Request for updating PaymentMethod
     *
     * @apiVersion 0.0.1
     * @apiName updatePaymentMethod
     * @apiGroup Payment Method
     *
     * @apiParam {String} id Unique id of PaymentMethod
     * @apiParamExample {json} Request-Example:
     {
           "_id": "565f2e05ab70d49024242e10",
           "name": "CASH UAH",
           "account": "CASH UAH",
           "currency": "USD",
           "bank": "",
           "owner": "CASH UAH"
     }
     *
     * @apiSuccess {Object} UpdatedPaymentMethod
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "_id": "565f2e05ab70d49024242e10",
           "name": "CASH UAH",
           "account": "CASH UAH",
           "currency": "UAH",
           "bank": "",
           "owner": "CASH UAH"
     }
     */
    router.put('/:id', accessStackMiddleware, handler.update);

    /**
     *@api {post} /paymentMethod/ Request for creating new PaymentMethod
     *
     * @apiVersion 0.0.1
     * @apiName createNewPaymentMethod
     * @apiGroup Payment Method
     * @apiParamExample {json} Request-Example:
     {
         "currency": "EUR",
         "name": "CASH EUR",
         "account": "",
         "bank": ""
     }
     *
     * @apiSuccess {Object} NewPaymentMethod
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "__v": 0,
         "currency": "EUR",
         "name": "CASH EUR",
         "account": "",
         "bank": "",
         "_id": "5788d01e08e8dd0209d11a08",
         "owner": ""
     }
     */
    router.post('/', accessStackMiddleware, handler.create);

    /**
     *@api {delete} /paymentMethod/:id Request for deleting PaymentMethod
     *
     * @apiVersion 0.0.1
     * @apiName deletePaymentMethod
     * @apiGroup Payment Method
     *
     * @apiParam {String} id Unique id of PaymentMethod
     *
     * @apiSuccess {Object} DeletedPaymentMethod
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": "5788d01e08e8dd0209d11a08",
         "currency": "EUR",
         "name": "CASH EUR",
         "account": "",
         "bank": "",
         "__v": 0,
         "owner": ""
     }
     */
    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
