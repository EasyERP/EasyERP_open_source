var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.ORDERS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /orders/ Request Orders
     *
     * @apiVersion 0.0.1
     * @apiName getOrders
     * @apiGroup Order
     *
     * @apiParam {String} contentType="salesOrders"
     * @apiParam {String} id Unique id of Order
     *
     * @apiSuccess {Object} Orders
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "_id": "5783acf5f810fcf53eb2f0a9",
    "__v": 0,
    "proformaCounter": 0,
    "editedBy": {
        "date": "2016-07-11T14:28:22.360Z",
        "user": "561e37f7d6c741e8235f42cb"
    },
    "createdBy": {
        "date": "2016-07-11T14:28:05.847Z",
        "user": "561e37f7d6c741e8235f42cb"
    },
    "creationDate": "2016-07-11T14:28:05.847Z",
    "groups": {
        "group": [],
        "users": [],
        "owner": null
    },
    "attachments": [],
    "whoCanRW": "everyOne",
    "workflow": {
        "_id": "55647b962e4aa3804a765ec6",
        "name": "Invoiced",
        "status": "Done"
    },
    "products": [
        {
            "scheduledDate": "",
            "jobs": {
                "_id": "57597f9b3319da9d6ac1c13b",
                "name": "09.06.16 - 08.07.16"
            },
            "description": "",
            "product": {
                "_id": "5540d528dacb551c24000003",
                "name": "IT services"
            },
            "unitPrice": 120600,
            "subTotal": 120600,
            "taxes": null,
            "quantity": 1
        }
    ],
    "paymentInfo": {
        "taxes": 0,
        "unTaxed": 120600,
        "total": 120600
    },
    "paymentTerm": null,
    "invoiceRecived": false,
    "invoiceControl": null,
    "incoterm": null,
    "destination": null,
    "name": "PO1171",
    "expectedDate": "2016-07-10T22:00:00.000Z",
    "orderDate": "2016-07-11T14:28:21.000Z",
    "deliverTo": {
        "_id": "55543831d51bdef79ea0d58c",
        "name": "YourCompany"
    },
    "project": {
        "_id": "571de200d4761c212289b7dc",
        "name": "Gifted"
    },
    "supplier": {
        "_id": "5719e4f7abaa894076dbb2d3",
        "name": {
            "last": "Hogan",
            "first": "Cory"
        },
        "fullName": "Cory Hogan",
        "id": "5719e4f7abaa894076dbb2d3"
    },
    "isOrder": true,
    "type": "Not Invoiced",
    "forSales": true,
    "currency": {
        "rate": 0,
        "_id": {
            "_id": "565eab29aeb95fa9c0f9df2d",
            "sequence": 0,
            "name": "USD"
        }
    }
}
     */
    router.get('/', accessStackMiddleware, handler.getByViewType);

    router.get('/:id', handler.getById);
    
    /**
     *@api {get} /orders/ Request FilterOrders
     *
     * @apiVersion 0.0.1
     * @apiName getFilterOrders
     * @apiGroup Order
     *
     * @apiSuccess {Object} FilterOrders
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

    router.patch('/:id', accessStackMiddleware, handler.putchModel);

    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
