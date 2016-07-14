var express = require('express');
var router = express.Router();
var ProformaHandler = require('../handlers/proforma');
var InvoiceHandler = require('../handlers/invoice');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new ProformaHandler(models, event);
    var iHandler = new InvoiceHandler(models, event);

    var moduleId = MODULES.PROFORMA;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);


    /**
     *@api {get} /proforma/ Request Proforma
     *
     * @apiVersion 0.0.1
     * @apiName getProforma
     * @apiGroup Proforma
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of salesProforma which will show
     * @apiParam (?Field=value) {String} contentType="salesProforma" Type of content
     *
     * @apiParam (?Field=value) {Boolean} forSales=true
     * @apiParam (?Field=value) {Object} filter={5BforSales:{key:"forSales", type: "Boolean",value:true}}
     *
     * @apiSuccess {Object} Proforma
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
            "total": 33,
            "data": [
                {
                    "_id": "577a2572ca7bd4d021041d4e",
                    "total": 33,
                    "salesPerson": {
                        "name": {
                            "last": "Lendyel",
                            "first": "Eugen"
                        },
                        "_id": "56029cc950de7f4138000005"
                    },
                    "workflow": {
                        "_id": "56fabce2e71823e438e4e1c9",
                        "status": "Done",
                        "name": "Paid"
                    },
                    "supplier": {
                        "_id": "56e290f1896e98a661aa831a",
                        "name": {
                            "last": "",
                            "first": "Game scale"
                        }
                    },
                    "project": {
                        "_id": "577509417134263421caa2cc",
                        "name": "BlackJack Surrender"
                    },
                    "currency": {
                        "rate": 1,
                        "_id": "565eab29aeb95fa9c0f9df2d"
                    },
                    "journal": {
                        "_id": "57035e4321f9b0c4313d4146",
                        "name": "Proforma Journal"
                    },
                    "paymentInfo": {
                        "taxes": 0,
                        "unTaxed": 52800,
                        "balance": 0,
                        "total": 52800
                    },
                    "invoiceDate": "2016-07-04T17:33:54.000Z",
                    "name": "PO1146_1",
                    "paymentDate": "2016-07-07T17:34:04.000Z",
                    "dueDate": "2016-07-14T22:00:00.000Z",
                    "approved": true,
                    "removable": true,
                    "paid": 528,
                    "editedBy": {
                        "date": "2016-07-07T17:33:52.708Z"
                    }
                },
                ...
            ]
        }
     */
    router.get('/', iHandler.getForView);

    /**
     *@api {get} /proforma/stats/project Request ProformaStatsForProject
     *
     * @apiVersion 0.0.1
     * @apiName getProformaStatsForProject
     * @apiGroup Proforma
     *
     * @apiParam (?Field=value) {Object} filter={project:{key:"project._id",value:...}}
     *
     * @apiSuccess {Object} ProformaStatsForProject
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
            "success": {
                "_id": null,
                "invoices": [
                    {
                        "_id": "5710d954bdf5e5ce780db66e",
                        "name": "PO975",
                        "status": "Paid",
                        "currency": {
                            "_id": "565eab29aeb95fa9c0f9df2d",
                            "rate": 1
                        },
                        "paymentInfo": {
                            "ammount": 3000,
                            "paid": 3000,
                            "balance": 0
                        }
                    }
                ],
                "ammount": 3000,
                "paid": 3000,
                "balance": 0
            }
        }
     */
    router.get('/stats/project', iHandler.getStatsForProject);

    /**
     *@api {post} /proforma/ Request for creating new Proforma
     *
     * @apiVersion 0.0.1
     * @apiName createNewProforma
     * @apiGroup Proforma
     *
     * @apiParamExample {json} Request-Example:
     * {
          "forSales": true,
          "quotationId": "577d1f7de292572a56cd8d45",
          "currency": {
            "rate": 1,
            "_id": {
              "_id": "565eab29aeb95fa9c0f9df2d",
              "sequence": 0,
              "name": "USD"
            }
          },
          "journal": "57035e4321f9b0c4313d4146"
        }
     *
     * @apiSuccess {Object} NewProforma
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
          "__v": 0,
          "_type": "Proforma",
          "products": [
            {
              "unitPrice": 100000,
              "subTotal": 100000,
              "taxes": null,
              "jobs": "574be45a33b93d771f443485",
              "description": "",
              "product": "5540d528dacb551c24000003",
              "quantity": 1
            }
          ],
          "_id": "578736a7c244f4ce11c0b44a",
          "project": "55b92ad621e4b7c40f00067f",
          "emailed": false,
          "approved": false,
          "removable": true,
          "invoiced": false,
          "notes": [

          ],
          "attachments": [

          ],
          "editedBy": {
            "date": "2016-07-14T06:52:22.760Z",
            "user": "52203e707d4dba8813000003"
          },
          "createdBy": {
            "date": "2016-07-06T15:10:53.959Z",
            "user": "52203e707d4dba8813000003"
          },
          "creationDate": "2016-07-06T15:10:53.959Z",
          "groups": {
            "group": [

            ],
            "users": [

            ],
            "owner": null
          },
          "whoCanRW": "everyOne",
          "workflow": "56fabc6b5ad5d96f4fb08eab",
          "payments": [

          ],
          "paymentInfo": {
            "taxes": 0,
            "unTaxed": 100000,
            "balance": 100000,
            "total": 100000
          },
          "paymentTerms": null,
          "salesPerson": null,
          "currency": {
            "rate": 1,
            "_id": "565eab29aeb95fa9c0f9df2d"
          },
          "journal": "57035e4321f9b0c4313d4146",
          "invoiceDate": "2016-07-06T06:52:22.000Z",
          "paymentReference": "PO1154",
          "sourceDocument": "577d1f7de292572a56cd8d45",
          "supplier": "5745b287a23923582dee44b8",
          "forSales": true,
          "name": "PO1154_1"
        }
     */
    router.post('/', handler.create);
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, iHandler.uploadFile);
    
    router.delete('/', iHandler.bulkRemove);
    
    return router;
};
