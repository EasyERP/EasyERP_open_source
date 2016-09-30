var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoice');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new InvoiceHandler(models, event);
    var moduleId = MODULES.INVOICE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /invoices/ Request Invoices
     *
     * @apiVersion 0.0.1
     * @apiName getInvoices
     * @apiGroup Invoice
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Invoices which will show
     *
     * @apiParam (?Field=value) {String} filter-forSales-key="forSales" Property of filter object
     * @apiParam (?Field=value) {String} filter-forSales-type="Boolean" Property of filter object
     * @apiParam (?Field=value) {String[]} filter-forSales-value='["true"]' Property of filter object
     *
     * @apiParam (?Field=value) {String} contentType="salesInvoices" Type of content
     * @apiParam (?Field=value) {Boolean} forSales=true Type of content
     *
     * @apiSuccess {Object} Invoices Fetched Invoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "total": 731,
         "data": [
             {
                 "_id": "577a7da67134263421cab3ee",
                 "total": 731,
                 "salesPerson": {
                     "name": {
                         "last": "Voloshchuk",
                         "first": "Peter"
                     },
                     "_id": "55b92ad221e4b7c40f00005f"
                 },
                 "workflow": {
                     "_id": "5555e54c6a3f01acae0b5564",
                     "name": "Draft",
                     "status": "New"
                 },
                 "supplier": {
                     "_id": "573489c07a1132cd762a6405",
                     "name": {
                         "last": "",
                         "first": "InProjetech LTD"
                     }
                 },
                 "project": {
                     "_id": "568b85b33cce9254776f2b4c",
                     "name": "FluxIOT"
                 },
                 "currency": {
                     "rate": 1,
                     "_id": "565eab29aeb95fa9c0f9df2d"
                 },
                 "journal": {
                     "_id": "565ef6ba270f53d02ee71d65",
                     "name": "Invoice Journal"
                 },
                 "paymentInfo": {
                     "taxes": 0,
                     "unTaxed": 400000,
                     "balance": 400000,
                     "total": 400000
                 },
                 "invoiceDate": "2016-07-04T06:50:12.000Z",
                 "name": "PI050716",
                 "dueDate": "2016-07-19T22:00:00.000Z",
                 "approved": false,
                 "removable": true,
                 "paid": 0,
                 "editedBy": {
                     "date": "2016-07-05T06:49:50.624Z"
                 }
             },
             ...
             ]
     }
     */
    router.get('/', accessStackMiddleware, function (req, res, next) {
        var viewType = req.query.viewType;
        switch (viewType) {
            case 'form':
                handler.getInvoiceById(req, res, next);
                break;
            case 'list':
                handler.getForView(req, res, next);
                break;
            default:
                handler.getAll(req, res, next);
        }
    });

    /**
     *@api {get} /invoices/getFilterValues Request Filter values
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Invoice
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
         "_id": null,
         "Due date": [
             "2016-07-19T22:00:00.000Z",
             "2016-06-28T22:00:00.000Z",
             "2016-06-21T22:00:00.000Z",
             "2016-07-14T22:00:00.000Z",
             ...
         ]
     }
     ]
     * */
    router.get('/getFilterValues', handler.getFilterValues);

    /**
     *@api {get} /invoices/getSalesByCountry Request SalesByCountry
     *
     * @apiVersion 0.0.1
     * @apiName getSalesByCountry
     * @apiGroup Invoice
     *
     * @apiParam (?Field=value) {String} startDay
     * @apiParam (?Field=value) {String} endDay
     *
     * @apiSuccess {Object} SalesByCountry
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
             {
                 "_id": null,
                 "pays": 30000
             },
             {
                 "_id": "Germany",
                 "pays": 1693000
             },
             {
                 "_id": "Italy",
                 "pays": 500000
             },
             {
                 "_id": "Israel",
                 "pays": 1300000
             },
             {
                 "_id": "UAE",
                 "pays": 250000
             },
             {
                 "_id": "Sweden",
                 "pays": 2000000
             },
             {
                 "_id": "Ireland",
                 "pays": 102400
             },
             {
                 "_id": "Hungary",
                 "pays": 224000
             }
         ]
     }
     * */
    router.get('/getSalesByCountry', handler.getSalesByCountry);
    router.get('/generateName', accessStackMiddleware, handler.generateName);
    router.get('/invoiceByWeek', accessStackMiddleware, handler.invoiceByWeek);
    router.get('/revenueBySales', accessStackMiddleware, handler.revenueBySales);
    router.get('/revenueByCountry', accessStackMiddleware, handler.revenueByCountry);
    router.get('/revenueByCustomer', accessStackMiddleware, handler.revenueByCustomer);
    router.get('/stats', accessStackMiddleware, handler.getStats);

    router.get('/:id', handler.getStats);

    /**
     *@api {get} /invoices/stats/project Request stats for project
     *
     * @apiVersion 0.0.1
     * @apiName getStatsForProject
     * @apiGroup Invoice
     *
     * @apiSuccess {Object} StatsForProject
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": {
             "_id": null,
             "invoices": [
               {
                 "_id": "55b92ae121e4b7c40f00122a",
                 "name": "17-15/01/15",
                 "status": "Paid",
                 "currency": {
                   "_id": "565eab29aeb95fa9c0f9df2d",
                   "rate": 1
                 },
                 "paymentInfo": {
                   "ammount": 455,
                   "paid": 455,
                   "balance": 0
                 }
               }
             ],
             "ammount": 455,
             "paid": 455,
             "balance": 0
         }
     }
     *
     * */
    router.get('/stats/project', accessStackMiddleware, handler.getStatsForProject);
    router.get('/chart', accessStackMiddleware, handler.chartForProject);
    router.get('/emails/:id', accessStackMiddleware, handler.getEmails);
    router.patch('/approve', accessStackMiddleware, handler.approve);

    /**
     *@api {patch} /invoices/:id Request for updating only selected fields of Invoice
     *
     * @apiVersion 0.0.1
     * @apiName UpdateOnlySelectedFields
     * @apiGroup Invoice
     *
     * @apiParam {String} id Unique id of Invoice
     * @apiParamExample {json} Request-Example:
     {
         "currency": {
             "_id": "565eab29aeb95fa9c0f9df2d",
             "name": "USD"
         },
         "supplier": "573489c07a1132cd762a6405",
         "fiscalPosition": null,
         "name": "PI050716",
         "invoiceDate": "2016-07-10T07:35:06.000Z",
         "dueDate": "20 Jul, 2016",
         "account": null,
         "journal": null,
         "salesPerson": null,
         "paymentTerms": null,
         "groups": {
         "owner": null,
         "users": [
         
         ],
         "group": [
         
         ]
         },
         "whoCanRW": "everyOne",
         "workflow": "5555e54c6a3f01acae0b5564"
     }
     *
     * @apiSuccess {Object} UpdatedInvoice
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "_id": "577a7da67134263421cab3ee",
           "_type": "wTrackInvoice",
           "__v": 0,
           "dueDate": "2016-07-19T21:00:00.000Z",
           "products": [
             {
               "unitPrice": 400000,
               "subTotal": 400000,
               "taxes": null,
               "jobs": "577a7d23d2658cb5213589b0",
               "description": "",
               "product": "5540d528dacb551c24000003",
               "quantity": 1
             }
           ],
           "project": "568b85b33cce9254776f2b4c",
           "emailed": false,
           "approved": false,
           "removable": true,
           "invoiced": false,
           "notes": [
         
           ],
           "attachments": [
             {
               "_id": "577b586e9d43bc7c213c5b47",
               "name": "FluxIO_PI040716.pdf",
               "shortPas": "uploads%2Finvoices%2F577a7da67134263421cab3ee%2FFluxIO_PI040716.pdf",
               "size": "0.15&nbsp;Mb",
               "uploadDate": "2016-07-05T06:49:18.039Z",
               "uploaderName": "gabriella.shterr"
             }
           ],
           "editedBy": {
             "date": "2016-07-12T07:35:06.623Z",
             "user": "52203e707d4dba8813000003"
           },
           "createdBy": {
             "date": "2016-07-04T15:15:41.246Z",
             "user": "563b58c2ab9698be7c9df6b6"
           },
           "creationDate": "2016-07-04T15:15:41.246Z",
           "groups": {
             "group": [
         
             ],
             "users": [
         
             ],
             "owner": null
           },
           "whoCanRW": "everyOne",
           "workflow": "5555e54c6a3f01acae0b5564",
           "payments": [
         
           ],
           "paymentInfo": {
             "taxes": 0,
             "unTaxed": 400000,
             "balance": 400000,
             "total": 400000
           },
           "paymentTerms": null,
           "salesPerson": null,
           "currency": {
             "rate": 1,
             "_id": "565eab29aeb95fa9c0f9df2d"
           },
           "journal": "565ef6ba270f53d02ee71d65",
           "invoiceDate": "2016-07-10T07:35:06.000Z",
           "paymentReference": "PO1149",
           "sourceDocument": "577a7d9dd2658cb5213589b1",
           "supplier": {
             "_id": "573489c07a1132cd762a6405",
             "name": {
               "last": "",
               "first": "InProjetech LTD"
             },
             "fullName": "InProjetech LTD ",
             "id": "573489c07a1132cd762a6405"
           },
           "forSales": true,
           "name": "PI050716",
           "id": "577a7da67134263421cab3ee"
     }
     * */
    router.patch('/:id', accessStackMiddleware, handler.updateOnlySelected);
    router.put('/:_id', accessStackMiddleware, function (req, res) {
        var data = {};
        var id = req.params._id;

        data.invoice = req.body;

        handler.updateInvoice(req, res, id, data);
    });
    router.post('/', accessStackMiddleware, handler.create);
    router.post('/receive', accessStackMiddleware, handler.receive);
    // router.post('/attach', multipartMiddleware, handler.attach);
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {delete} /invoices/:id Request for deleting Invoice
     *
     * @apiVersion 0.0.1
     * @apiName DeleteInvoice
     * @apiGroup Invoice
     *
     * @apiParam {String} id Unique id of Invoice
     * @apiSuccess {Object} DeletedInvoice
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "_id": "5783ad06f810fcf53eb2f0aa",
           "_type": "wTrackInvoice",
           "__v": 0,
           "dueDate": "2016-08-10T22:00:00.000Z",
           "products": [
             {
               "unitPrice": 120600,
               "subTotal": 120600,
               "taxes": null,
               "jobs": "57597f9b3319da9d6ac1c13b",
               "description": "",
               "product": "5540d528dacb551c24000003",
               "quantity": 1
             }
           ],
           "project": "571de200d4761c212289b7dc",
           "emailed": false,
           "approved": true,
           "removable": true,
           "invoiced": false,
           "notes": [
             
           ],
           "attachments": [
             {
               "_id": "5783ad2ad72226643fc8e0b0",
               "name": "Thinkmobiles invoices 08.07.2016.xlsx",
               "shortPas": "uploads%2Finvoices%2F5783ad06f810fcf53eb2f0aa%2FThinkmobiles%20invoices%2008.07.2016.xlsx",
               "size": "0.481&nbsp;Mb",
               "uploadDate": "2016-07-11T14:28:58.377Z",
               "uploaderName": "natalia.yartysh"
             }
           ],
           "editedBy": {
             "date": "2016-07-11T14:39:41.006Z",
             "user": "560255d1638625cf32000005"
           },
           "createdBy": {
             "date": "2016-07-11T14:28:05.847Z",
             "user": "561e37f7d6c741e8235f42cb"
           },
           "creationDate": "2016-07-11T14:28:05.847Z",
           "groups": {
             "group": [
               
             ],
             "users": [
               
             ],
             "owner": null
           },
           "whoCanRW": "everyOne",
           "workflow": "55647d932e4aa3804a765ec9",
           "payments": [
             
           ],
           "paymentInfo": {
             "taxes": 0,
             "unTaxed": 120600,
             "balance": 120600,
             "total": 120600
           },
           "paymentTerms": null,
           "salesPerson": null,
           "currency": {
             "rate": 1,
             "_id": "565eab29aeb95fa9c0f9df2d"
           },
           "journal": "565ef6ba270f53d02ee71d65",
           "invoiceDate": "2016-07-11T14:39:46.000Z",
           "paymentReference": "PO1171",
           "sourceDocument": "5783acf5f810fcf53eb2f0a9",
           "supplier": "5719e4f7abaa894076dbb2d3",
           "forSales": true,
           "name": "NG11072016",
           "id": "5783ad06f810fcf53eb2f0aa"
     }
     * */
    router.delete('/:_id', accessStackMiddleware, function (req, res) {
        var id = req.param('_id');

        handler.removeInvoice(req, res, id);
    });

    /**
     *@api {delete} /invoices/ Request for deleting selected Invoices
     *
     * @apiVersion 0.0.1
     * @apiName DeleteInvoices
     * @apiGroup Invoice
     *
     * @apiParamExample {json} Request-Example:
     {
           "contentType": "salesInvoices",
           "ids": [
             "577a7da67134263421cab3ee"
           ]
     }
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
        "success":true
     }
     * */
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
