var express = require('express');
var router = express.Router();
var PaymentTermHandler = require('../handlers/paymentTerm');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PaymentTermHandler(models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /paymentTerm/ Request PaymentTerms
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentTerms
     * @apiGroup Payment Term
     *
     * @apiSuccess {Object} PaymentTerms
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "data": [
            {
              "_id": "55536e52475b7be475f335f6",
              "name": "15 Days"
            },
            {
              "_id": "55536e52475b7be475f335f8",
              "name": "30 Days End of Month"
            },
            {
              "_id": "55536e52475b7be475f335f9",
              "name": "30 Net Days"
            },
            {
              "_id": "55536e52475b7be475f335f7",
              "name": "30% Advance End 30 Days"
            },
            {
              "_id": "55536e52475b7be475f335fa",
              "name": "Immediate Payment"
            }
          ]
        }
     */
    router.get('/', handler.getForDd);

    /**
     *@api {get} /paymentTerm/getForList/ Request PaymentTermsForList
     *
     * @apiVersion 0.0.1
     * @apiName getPaymentTermsForList
     * @apiGroup Payment Term
     *
     * @apiSuccess {Object} PaymentTermsForList
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
         {
             "_id": "55536e52475b7be475f335f6",
             "name": "15 Days"
         },
         {
             "_id": "55536e52475b7be475f335f8",
             "name": "30 Days End of Month"
         },
         {
             "_id": "55536e52475b7be475f335f9",
             "name": "30 Net Days"
         },
         {
             "_id": "55536e52475b7be475f335f7",
             "name": "30% Advance End 30 Days"
         },
         {
             "_id": "55536e52475b7be475f335fa",
             "name": "Immediate Payment"
         }
     ]
     */
    router.get('/getForList', handler.getForList);
   
    router.put('/:id', handler.update);
    router.post('/', handler.create);
    
    router.delete('/:id', handler.remove);

    return router;
};
