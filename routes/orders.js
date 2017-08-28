var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/order');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.ORDERS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'order', event);
    }

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /order/getByWorkflows Request OrdersByWorkflows
     *
     * @apiVersion 0.0.1
     * @apiName getOrdersByWorkflows
     * @apiGroup Order
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="true" is for sales or not
     *
     * @apiSuccess {Array} OrdersByWorkflows
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "_id": "57f4bcfe48c62c5c68690dbc",
       "total": 110,
       "status": [
         {
           "allocateStatus": "NOT",
           "shippingStatus": "NOT",
           "fulfillStatus": "NOT"
         }
       ],
       "name": "Processing",
       "count": 1
     },
     {
       "_id": "55647b962e4aa3804a765ec6",
       "total": 750521.1603553956,
       "status": [
         {
           "allocateStatus": "NOT",
           "shippingStatus": "NOT",
           "fulfillStatus": "NOT"
         },
         {
           "allocateStatus": "ALL",
           "fulfillStatus": "ALL",
           "shippingStatus": "ALL"
         },
         {
           "shippingStatus": "ALL",
           "fulfillStatus": "ALL",
           "allocateStatus": "ALL"
         }
       ],
       "name": "Invoiced",
       "count": 192
     },
     {
       "_id": "55647b932e4aa3804a765ec5",
       "total": 52340.22140137702,
       "status": [
         {
           "allocateStatus": "NOT",
           "shippingStatus": "NOT",
           "fulfillStatus": "NOT"
         },
         {
           "shippingStatus": "NOR",
           "fulfillStatus": "NOR",
           "allocateStatus": "NOR"
         },
         {
           "shippingStatus": "NOT",
           "fulfillStatus": "NOT",
           "allocateStatus": "NOT"
         },
         {
           "shippingStatus": "ALL",
           "fulfillStatus": "ALL",
           "allocateStatus": "ALL"
         }
       ],
       "name": "Draft/ Quotation",
       "count": 15
     }
     ]
     * */

    /**
     *@api {get} /order/getByWorkflows Request OrdersByWorkflows(Purchase)
     *
     * @apiVersion 0.0.1
     * @apiName getOrdersByWorkflows(Purchase)
     * @apiGroup Order
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="false" is for sales or not
     *
     * @apiSuccess {Array} OrdersByWorkflows(Purchase)
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "_id": "56599347bfd103f108eb4caa",
       "total": 1100,
       "status": [
         {
           "allocateStatus": "NOT",
           "shippingStatus": "NOT",
           "fulfillStatus": "NOT"
         }
       ],
       "name": "Invoiced received",
       "count": 1
     },
     {
       "_id": "5555bf276a3f01acae0b5562",
       "total": 200,
       "status": [
         {
           "allocateStatus": "ALL",
           "fulfillStatus": "ALL",
           "shippingStatus": "NOT"
         }
       ],
       "name": "Products received",
       "count": 1
     },
     {
       "_id": "5555bf276a3f01acae0b5561",
       "total": 46802.26,
       "status": [
         {
           "allocateStatus": "NOA",
           "fulfillStatus": "NOA",
           "shippingStatus": "NOT"
         },
         {
           "allocateStatus": "NOT",
           "shippingStatus": "NOT",
           "fulfillStatus": "NOT"
         },
         {
           "shippingStatus": "NOR",
           "fulfillStatus": "NOT",
           "allocateStatus": "NOR"
         },
         {
           "allocateStatus": "ALL",
           "fulfillStatus": "ALL",
           "shippingStatus": "NOT"
         }
       ],
       "name": "Pending PO",
       "count": 9
     }
     ]
     * */
    router.get('/getByWorkflows', handler.getByWorkflows);

    router.get('/getTotalForDashboard', handler.getTotalForDashboard);

    router.get('/getByStatus', handler.getByStatus);

    router.get('/:id', handler.getById);

    router.post('/', handler.create);

    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    router.patch('/:id', handler.putchModel);

    router.delete('/:id', handler.remove);

    router.delete('/', accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
