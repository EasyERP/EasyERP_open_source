var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.QUOTATIONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.get('/getFilterValues', accessStackMiddleware, handler.getFilterValues);

    router.post('/', accessStackMiddleware, handler.create);
    router.patch('/:id', accessStackMiddleware, handler.putchModel);

    /**
     *@api {put} /quotations/:id Request for updating Quotation
     *
     * @apiVersion 0.0.1
     * @apiName updateQuotation
     * @apiGroup Quotation
     *
     * @apiParam {String} id Unique id of Quotation
     * @apiParamExample {json} Request-Example:
     * {
          "validate": false,
          "supplier": "5745b287a23923582dee44b8",
          "project": "55b92ad621e4b7c40f00067f",
          "workflow": "5555bf276a3f01acae0b5560",
          "orderDate": "2016-07-06T06:52:22.000Z",
          "expectedDate": "06 Jul, 2016",
          "name": "PO1154",
          "invoiceControl": "",
          "invoiceRecived": false,
          "paymentTerm": "",
          "fiscalPosition": "",
          "destination": "",
          "incoterm": "",
          "products": [
            {
              "product": "5540d528dacb551c24000003",
              "unitPrice": 100000,
              "quantity": "\n        \n            1\n        \n    ",
              "scheduledDate": "",
              "taxes": null,
              "description": "",
              "subTotal": 100000,
              "jobs": "574be45a33b93d771f443485"
            }
          ],
          "_id": "577d1f7de292572a56cd8d45",
          "__v": 0,
          "proformaCounter": 0,
          "editedBy": {
            "date": "2016-07-06T15:10:53.959Z",
            "user": "56239e58e9576d1728a9ed1f"
          },
          "createdBy": {
            "date": "2016-07-06T15:10:53.959Z",
            "user": "56239e58e9576d1728a9ed1f"
          },
          "creationDate": "2016-07-06T15:10:53.959Z",
          "groups": {
            "owner": null,
            "users": [

            ],
            "group": [

            ]
          },
          "attachments": [

          ],
          "whoCanRW": "everyOne",
          "paymentInfo": {
            "total": 100000,
            "unTaxed": 100000,
            "taxes": 0
          },
          "deliverTo": "55543831d51bdef79ea0d58c",
          "isOrder": false,
          "type": "Not Ordered",
          "forSales": true,
          "currency": {
            "_id": "565eab29aeb95fa9c0f9df2d",
            "name": "USD"
          }
        }
     *
     * @apiSuccess {Object} UpdatedQuotation
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "success": "Quotation updated",
          "result": {
            "_id": "577d1f7de292572a56cd8d45",
            "__v": 0,
            "proformaCounter": 0,
            "editedBy": {
              "date": "2016-07-14T06:52:22.760Z",
              "user": "52203e707d4dba8813000003"
            },
            "createdBy": {
              "date": "2016-07-06T15:10:53.959Z",
              "user": "56239e58e9576d1728a9ed1f"
            },
            "creationDate": "2016-07-06T15:10:53.959Z",
            "groups": {
              "group": [

              ],
              "users": [

              ],
              "owner": null
            },
            "attachments": [

            ],
            "whoCanRW": "everyOne",
            "workflow": "5555bf276a3f01acae0b5560",
            "products": [
              {
                "scheduledDate": "",
                "jobs": "574be45a33b93d771f443485",
                "description": "",
                "product": "5540d528dacb551c24000003",
                "unitPrice": 100000,
                "subTotal": 100000,
                "taxes": null,
                "quantity": 1
              }
            ],
            "paymentInfo": {
              "taxes": 0,
              "unTaxed": 100000,
              "total": 100000
            },
            "paymentTerm": null,
            "invoiceRecived": false,
            "invoiceControl": null,
            "incoterm": null,
            "destination": null,
            "name": "PO1154",
            "expectedDate": "2016-07-05T21:00:00.000Z",
            "orderDate": "2016-07-06T06:52:22.000Z",
            "deliverTo": "55543831d51bdef79ea0d58c",
            "project": "55b92ad621e4b7c40f00067f",
            "supplier": "5745b287a23923582dee44b8",
            "isOrder": false,
            "type": "Not Ordered",
            "forSales": true,
            "currency": {
              "rate": 1,
              "_id": "565eab29aeb95fa9c0f9df2d"
            }
          }
        }
     */
    router.put('/:id', accessStackMiddleware, handler.updateModel);

    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
