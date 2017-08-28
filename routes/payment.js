var express = require('express');
var router = express.Router();
var PaymentHandler = require('../handlers/payment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new PaymentHandler(models, event);
    var moduleId = MODULES.CUSTOMER_PAYMENTS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'payment', event);
    }

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /payments/ Request Payments
     *
     * @apiVersion 0.0.1
     * @apiName getPayments
     * @apiGroup Payment
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=50 Count of Payments which will show
     * @apiParam (?Field=value) {String="customerPayments","purchasePayments"} contentType Type of content
     *
     * @apiSuccess {Object} Payments
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
  total: 2,
  data: [
    {
      _id: "55b92ae221e4b7c40f001396",
      total: 2,
      supplier: {
        _id: "574816b3c8a63a5268a46a96",
        name: {
          last: "",
          first: "Tinybeans"
        }
      },
      currency: {
        rate: 1,
        name: "USD",
        symbol: "$",
        _id: "USD"
      },
      invoice: {
        _id: "55b92ae121e4b7c40f00126f",
        workflow: {
          name: "Paid"
        },
        name: "20-25/01/15"
      },
      assigned: {
        _id: "55b92ad221e4b7c40f00004a",
        name: {
          last: "Ostroverkh",
          first: "Oleg"
        }
      },
      bankExpenses: {

      },
      forSale: true,
      differenceAmount: 0,
      name: "1080_2523",
      paidAmount: 442000,
      workflow: "Paid",
      date: "2014-08-25T04:00:00.000Z",
      paymentMethod: {
        _id: "565f2e05ab70d49024242e0f",
        name: "CASH USD"
      },
      paymentRef: "",
      period: null,
      _type: "InvoicePayment",
      removable: true
    },
    {
      _id: "55b92ae321e4b7c40f0013a9",
      total: 2,
      supplier: {
        _id: "574816b3c8a63a5268a46a96",
        name: {
          last: "",
          first: "Tinybeans"
        }
      },
      currency: {
        rate: 1,
        name: "USD",
        symbol: "$",
        _id: "USD"
      },
      invoice: {
        _id: "55b92ae121e4b7c40f00126b",
        workflow: {
          name: "Paid"
        },
        name: "20-25/01/15"
      },
      assigned: {
        _id: "55b92ad221e4b7c40f00004a",
        name: {
          last: "Ostroverkh",
          first: "Oleg"
        }
      },
      bankExpenses: {

      },
      forSale: true,
      differenceAmount: 0,
      name: "1078_2542",
      paidAmount: 31200,
      workflow: "Paid",
      date: "2014-08-18T04:00:00.000Z",
      paymentMethod: {
        _id: "565f2e05ab70d49024242e0f",
        name: "CASH USD"
      },
      paymentRef: "",
      period: null,
      _type: "InvoicePayment",
      removable: true
    }
  ]
}
     */
    router.get('/', handler.getForView);
    router.get('/amountLeftCalc', handler.amountLeftCalc);
    router.get('/getForProject', handler.getForProject);
    router.get('/getPrepayments', handler.getPrepayments);
    router.get('/refundAmount', handler.refundAmount);

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
     {
           "contentType": "DividendPayments",
           "ids": [
                 "572ca04a55c631a239a57cfc",
                 "572ca03c526c630639837960"
           ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":true
     }
     */
    router.delete('/', handler.bulkRemove);

    return router;
};
