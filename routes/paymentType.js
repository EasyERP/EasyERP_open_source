var express = require('express');
var router = express.Router();
var PaymentTypeHandler = require('../handlers/paymentType');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PaymentTypeHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /paymentType/ Request PaymentTypes
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentTypes
     * @apiGroup PaymentType
     *
     * @apiSuccess {Object} PaymentTypes
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *      []
     */
    router.get('/', handler.getForDd);

    return router;
};
