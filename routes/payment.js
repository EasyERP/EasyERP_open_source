var express = require('express');
var router = express.Router();
var PaymentHandler = require('../handlers/payment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new PaymentHandler(models, event);
    var moduleId = MODULES.CUSTOMER_PAYMENTS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /payment/ Request Payments
     *
     * @apiVersion 0.0.1
     * @apiName getPayments
     * @apiGroup Payment
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Payments which will show
     * @apiParam (?Field=value) {String="PayrollPayments","DividendPayments"} contentType Type of content
     *
     * @apiSuccess {Object} Payments
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
        "total": 0,
        "data": []
        }
     */
    router.get('/', handler.getForView);
    router.get('/amountLeftCalc', handler.amountLeftCalc);
    router.get('/getForProject', handler.getForProject);

    router.post('/', handler.create);
    router.post('/supplier', handler.createPayOut);
    router.post('/salary', handler.salaryPayOut);
    router.patch('/:byType', handler.putchBulk);

    router.delete('/:id', handler.remove);

    /**
     *@api {delete} /payment/ Request for deleting selected Payments
     *
     * @apiVersion 0.0.1
     * @apiName deletePayments
     * @apiGroup Payment
     *
     * @apiParamExample {json} Request-Example:
     * {
          "contentType": "DividendPayments",
          "ids": [
            "572ca04a55c631a239a57cfc",
            "572ca03c526c630639837960"
          ]
        }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {"success":true}
     */
    router.delete('/', handler.bulkRemove);

    return router;
};
