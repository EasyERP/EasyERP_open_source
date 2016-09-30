var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.QUOTATIONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /quotations/ Request Quotations
     *
     * @apiVersion 0.0.1
     * @apiName getQuotations
     * @apiGroup Quotation
     *
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Quotations which will show
     * @apiParam (?Field=value) {String} contentType="salesQuotations" Type of content
     *
     * @apiParam {Object} filter={forSales : {key : "forSales", type : "boolean", value : true}}
     *
     * @apiSuccess {Object} Quotations
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "total": 31,
      "data": [
        {
          "_id": "577d1ece3e23cb6656e89455",
          "total": 31,
          "salesManager": {
            "name": {
              "last": "Sikora",
              "first": "Olga"
            }
          },
          "name": "PO1153",
          "paymentInfo": {
            "total": 92500
          },
          "orderDate": "2016-07-06T08:31:00.000Z",
          "workflow": {
            "_id": "55647b932e4aa3804a765ec5",
            "name": "Not Invoiced",
            "status": "New"
          },
          "supplier": {
            "_id": "5604170eb904af832d000005",
            "name": {
              "last": "",
              "first": "Stentle"
            }
          },
          "currency": {
            "rate": 0.90075,
            "_id": "565eab34aeb95fa9c0f9df2e"
          },
          "project": {
            "_id": "5732cda74b20992a37961efc",
            "name": "Sandos E-Learning"
          },
          "proformaCounter": 0
        },
        ...
      ]
}
     */
    router.get('/', accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /quotations/getFilterValues/ Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Quotation
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "_id": null,
         "Order date": [
             "2016-07-11T11:06:06.000Z",
             "2016-07-11T10:33:42.000Z",
             ...
         ]
     }
     ]
     */
    router.get('/getFilterValues', handler.getFilterValues);

    router.get('/:id', accessStackMiddleware, handler.getById);

    /**
     *@api {post} /quotations/ Request for creating new Quotation
     *
     * @apiVersion 0.0.1
     * @apiName createQuotation
     * @apiGroup Quotation
     *
     * @apiParamExample {json} Request-Example:
{
      "supplier": "57347f7fa91aace5132deff9",
      "project": "573db3d09fdef3d14282b561",
      "workflow": "5555bf276a3f01acae0b5560",
      "supplierReference": "",
      "orderDate": "2016-07-14T15:02:43.000Z",
      "expectedDate": "14 Jul, 2016",
      "name": "PO",
      "invoiceControl": "",
      "invoiceRecived": false,
      "paymentTerm": "",
      "fiscalPosition": "",
      "destination": "",
      "incoterm": "",
      "products": [
        {
          "product": "5540d528dacb551c24000003",
          "unitPrice": "30",
          "quantity": "1",
          "taxes": "0.00",
          "description": "",
          "subTotal": 3000,
          "jobs": "5787a78be310cbc64dc9d2f5"
        }
      ],
      "currency": {
        "_id": "565eab29aeb95fa9c0f9df2d",
        "name": "USD"
      },
      "forSales": true,
      "deliverTo": "55543831d51bdef79ea0d58c",
      "populate": true,
      "paymentInfo": {
        "total": 3000,
        "unTaxed": 3000,
        "taxes": "0.00"
      },
      "groups": {
        "owner": null,
        "users": [
    
        ],
        "group": [
    
        ]
      },
      "whoCanRW": "everyOne"
}
     *
     * @apiSuccess {Object} NewQuotation
     * @apiSuccessExample Success-Response:
HTTP/1.1 201 Created
{
      "__v": 0,
      "_id": "5787a994e310cbc64dc9d2f9",
      "proformaCounter": 0,
      "editedBy": {
        "date": "2016-07-14T15:02:44.332Z",
        "user": "52203e707d4dba8813000003"
      },
      "createdBy": {
        "date": "2016-07-14T15:02:44.332Z",
        "user": "52203e707d4dba8813000003"
      },
      "creationDate": "2016-07-14T15:02:44.332Z",
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
      "workflow": {
        "_id": "5555bf276a3f01acae0b5560",
        "color": "#2C3E50",
        "name": "Not Ordered",
        "status": "New",
        "wId": "Purchase Order",
        "wName": "order",
        "source": "purchase",
        "targetSource": [
          "quotation"
        ],
        "visible": true
      },
      "products": [
        {
          "jobs": "5787a78be310cbc64dc9d2f5",
          "description": "",
          "product": "5540d528dacb551c24000003",
          "unitPrice": 30,
          "subTotal": 3000,
          "taxes": 0,
          "quantity": 1
        }
      ],
      "paymentInfo": {
        "taxes": 0,
        "unTaxed": 3000,
        "total": 3000
      },
      "paymentTerm": null,
      "invoiceRecived": false,
      "invoiceControl": null,
      "incoterm": null,
      "destination": null,
      "name": "PO1175",
      "expectedDate": "2016-07-13T21:00:00.000Z",
      "orderDate": "2016-07-14T15:02:43.000Z",
      "deliverTo": "55543831d51bdef79ea0d58c",
      "project": {
        "_id": "573db3d09fdef3d14282b561",
        "name": "ADBC"
      },
      "supplier": {
        "_id": "57347f7fa91aace5132deff9",
        "name": {
          "last": "",
          "first": "Digipresence"
        },
        "fullName": "Digipresence ",
        "id": "57347f7fa91aace5132deff9"
      },
      "isOrder": false,
      "type": "Not Ordered",
      "forSales": true,
      "currency": {
        "rate": 1,
        "_id": "565eab29aeb95fa9c0f9df2d"
      }
}
     */
    router.post('/', accessStackMiddleware, handler.create);
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);
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
{
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
HTTP/1.1 200 OK
{
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

    /**
     *@api {delete} /quotations/:id Request for deleting Quotation
     *
     * @apiVersion 0.0.1
     * @apiName deleteQuotation
     * @apiGroup Quotation
     *
     * @apiParam {String} id Unique id of Quotation
     *
     * @apiSuccess {Object} DeletedQuotation
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": {
        "_id": "5787a994e310cbc64dc9d2f9",
        "__v": 0,
        "proformaCounter": 0,
        "editedBy": {
          "date": "2016-07-14T15:07:24.694Z",
          "user": "52203e707d4dba8813000003"
        },
        "createdBy": {
          "date": "2016-07-14T15:02:44.332Z",
          "user": "52203e707d4dba8813000003"
        },
        "creationDate": "2016-07-14T15:02:44.332Z",
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
            "jobs": "5787a78be310cbc64dc9d2f5",
            "description": "",
            "product": "5540d528dacb551c24000003",
            "unitPrice": 5000,
            "subTotal": 5000,
            "taxes": null,
            "quantity": 1
          }
        ],
        "paymentInfo": {
          "taxes": 0,
          "unTaxed": 5000,
          "total": 5000
        },
        "paymentTerm": null,
        "invoiceRecived": false,
        "invoiceControl": null,
        "incoterm": null,
        "destination": null,
        "name": "PO1175",
        "expectedDate": "2016-07-13T21:00:00.000Z",
        "orderDate": "2016-07-14T15:07:24.000Z",
        "deliverTo": "55543831d51bdef79ea0d58c",
        "project": "573db3d09fdef3d14282b561",
        "supplier": "57347f7fa91aace5132deff9",
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
    router.delete('/:id', accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /quotations/ Request for deleting selected Quotations
     *
     * @apiVersion 0.0.1
     * @apiName deleteQuotations
     * @apiGroup Quotation
     *
     * @apiParamExample {json} Request-Example:
{
    "contentType": "salesQuotations",
    "ids": [
        "5787a994e310cbc64dc9d2f9",
        "577d1ece3e23cb6656e89455",
        "577d1f7de292572a56cd8d45"
    ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "ok": 1,
    "n": 2
}
     */
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
