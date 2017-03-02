var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoices');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new InvoiceHandler(models, event);
    var moduleId = MODULES.PURCHASEINVOICES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /purchaseInvoices/ Request purchaseInvoices
     *
     * @apiVersion 0.0.1
     * @apiName getPurchaseInvoices
     * @apiGroup purchaseInvoices
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of purchaseInvoices which will show
     *
     * @apiParam (?Field=value) {String} filter-forSales-key="forSales" Property of filter object
     * @apiParam (?Field=value) {String} filter-forSales-type="Boolean" Property of filter object
     * @apiParam (?Field=value) {String[]} filter-forSales-value='["false"]' Property of filter object
     *
     * @apiParam (?Field=value) {String} contentType="purchaseInvoices" Type of content
     * @apiParam (?Field=value) {Boolean} forSales="false" Type of content
     *
     * @apiSuccess {Object} purchaseInvoices Fetched purchaseInvoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       total: 1,
       data: [
         {
           _id: "584fc4f2e1c14d4e363404f9",
           total: 1,
           salesPerson: {
             name: "Viktor Manhur",
             _id: "55f9298456f79c9c0c000006"
           },
           workflow: {
             _id: "55647d952e4aa3804a765eca",
             status: "In Progress",
             name: "Partially Paid"
           },
           supplier: {
             _id: "57a0432fa12c299d1cdc8feb",
             name: "Test Test"
           },
           currency: {
             rate: 1,
             _id: {
               _id: "USD",
               name: "USD",
               decPlace: 2,
               symbol: "$",
               active: true
             }
           },
           journal: {
             _id: "5788b4572bfddc9a494cce0a",
             name: "Invoice Purchase"
           },
           paymentInfo: {
             taxes: 0,
             discount: 0,
             unTaxed: 49500,
             balance: 29500,
             total: 49500
           },
           invoiceDate: "2016-12-13T00:00:00.000Z",
           name: "PI2",
           paymentDate: "2016-12-13T09:44:21.000Z",
           approved: false,
           removable: true,
           paid: 200,
           editedBy: {
             date: "2016-12-13T09:52:49.751Z"
           }
         },
     ...
       ]
     }
     */

    /**
     *@api {get} /invoices/ Request purchaseInvoice
     *
     * @apiVersion 0.0.1
     * @apiName getPurchaseInvoice
     * @apiGroup purchaseInvoices
     *
     * @apiParam (?Field=value) {String} viewType="form" Type of View
     * @apiParam (?Field=value) {String} id of purchaseInvoice
     * @apiParam (?Field=value) {String} forSales="false" Is for sales or not
     *
     * @apiSuccess {Object} purchaseInvoice
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       _id: "584fc4f2e1c14d4e363404f9",
       _type: "purchaseInvoices",
       paymentDate: "2016-12-13T09:44:21.000Z",
       __v: 0,
       reconcile: true,
       integrationId: "",
       project: null,
       emailed: false,
       approved: false,
       removable: true,
       invoiced: false,
       notes: [
         {
           date: "2016-12-13T09:52:50.947Z",
           history: {
             newValue: "Partially Paid",
             changedField: "Status",
             collectionName: "Invoice",
             contentId: "584fc4f2e1c14d4e363404f9",
             date: "2016-12-13T09:52:50.947Z"
           }
         },
         {
           date: "2016-12-13T09:52:50.947Z",
           history: {
             prevValue: null,
             newValue: "2016-12-13T00:00:00.000Z",
             changedField: "Invoice Date",
             collectionName: "Invoice",
             contentId: "584fc4f2e1c14d4e363404f9",
             date: "2016-12-13T09:52:50.947Z"
           }
         },
         {
           date: "2016-12-13T09:52:50.947Z",
           history: {
             prevValue: null,
             newValue: "2016-12-13T09:15:28.113Z",
             changedField: "Creation Date",
             collectionName: "Invoice",
             contentId: "584fc4f2e1c14d4e363404f9",
             date: "2016-12-13T09:52:50.947Z"
           }
         }
       ],
       attachments: [

       ],
       channel: null,
       editedBy: {
         date: "2016-12-13T09:52:49.751Z",
         user: {
           _id: "5849743af6af9b6178e67e99",
           login: "superAdmin"
         }
       },
       createdBy: {
         date: "2016-12-13T09:15:28.113Z",
         user: {
           _id: "5849743af6af9b6178e67e99",
           login: "superAdmin"
         }
       },
       creationDate: "2016-12-13T09:15:28.113Z",
       groups: {
         group: [

         ],
         users: [

         ],
         owner: null
       },
       whoCanRW: "everyOne",
       workflow: {
         _id: "55647d952e4aa3804a765eca",
         status: "In Progress",
         name: "Partially Paid"
       },
       payments: [

       ],
       paymentInfo: {
         taxes: 0,
         discount: 0,
         unTaxed: 49500,
         balance: 29500,
         total: 49500
       },
       paymentMethod: null,
       paymentTerms: null,
       salesPerson: "55f9298456f79c9c0c000006",
       currency: {
         rate: 1,
         _id: {
           _id: "USD",
           active: true,
           decPlace: 2,
           symbol: "$",
           name: "USD"
         }
       },
       journal: {
         _id: "5788b4572bfddc9a494cce0a",
         name: "Invoice Purchase"
       },
       invoiceDate: "2016-12-13T00:00:00.000Z",
       paymentReference: "PO_2",
       sourceDocument: {
         _id: "584fbc303a3e8718364754b5",
         name: "PO_2",
         orderDate: "2016-12-13T00:00:00.000Z"
       },
       supplier: {
         _id: "57a0432fa12c299d1cdc8feb",
         address: {
           country: "",
           zip: "",
           state: "",
           city: "",
           street: ""
         },
         name: {
           last: "Test",
           first: "Test"
         },
         fullName: "Test Test",
         id: "57a0432fa12c299d1cdc8feb"
       },
       forSales: false,
       name: "PI2",
       id: "584fc4f2e1c14d4e363404f9",
       products: [
         {
           _id: "584fbc303a3e8718364754bb",
           description: "",
           taxCode: null,
           channel: null,
           creditAccount: {
             _id: "58073e4e49519eac0c535a08",
             name: "111400 Stock received not Invoiced"
           },
           debitAccount: {
             _id: "5788b4be52adaf4c49e4b51c",
             name: "104002 Inventory"
           },
           creationDate: "2017-01-13T15:36:48.238Z",
           nominalCode: 0,
           subTotal: 49500,
           costPrice: null,
           unitPrice: 3300,
           taxes: [
             0
           ],
           quantity: 15,
           warehouse: {
             _id: "57dfc6ea6066337b771e99e2",
             name: "Main Warehouse"
           },
           order: "584fbc303a3e8718364754b5",
           product: {
             _id: "584aaabf7fea48343991e1b6",
             info: {
               EAN: "",
               ISBN: "",
               UPC: "",
               SKU: "",
               categories: [
                 "564591f9624e48551dfe3b23"
               ],
               brand: null,
               description: "",
               barcode: "",
               isActive: true,
               productType: "58453a4afc8d676a511283d0"
             },
             name: "demo product"
           },
           inStock: 1090,
           onHand: 890,
           allocated: 0,
           goodsNotes: [
             {
               _id: "584fc4b080e3848936461eb5",
               name: "PO_2*1",
               status: {

               },
               order: {
                 name: "PO_2"
               },
               warehouse: {
                 _id: "57dfc6ea6066337b771e99e2",
                 __v: 0,
                 account: "5788b4be52adaf4c49e4b51c",
                 editedBy: {
                   date: "2016-12-01T13:14:05.155Z",
                   user: null
                 },
                 createdBy: {
                   date: "2016-12-01T13:14:05.124Z",
                   user: null
                 },
                 main: true,
                 isOwn: true,
                 address: {
                   country: "",
                   zip: "",
                   state: "",
                   city: "",
                   street: ""
                 },
                 name: "Main Warehouse"
               },
               orderRow: "584fbc303a3e8718364754bb",
               quantity: 10
             }
           ],
           fulfilled: 10
         }
       ],
       account: {
         _id: "58073e4e49519eac0c535a08",
         name: "111400 Stock received not Invoiced"
       },
       goodsNotes: [
         {
           _id: "584fc4b080e3848936461eb5",
           name: "PO_2*1",
           status: {

           },
           order: {
             name: "PO_2"
           },
           warehouse: {
             _id: "57dfc6ea6066337b771e99e2",
             __v: 0,
             account: "5788b4be52adaf4c49e4b51c",
             editedBy: {
               date: "2016-12-01T13:14:05.155Z",
               user: null
             },
             createdBy: {
               date: "2016-12-01T13:14:05.124Z",
               user: null
             },
             main: true,
             isOwn: true,
             address: {
               country: "",
               zip: "",
               state: "",
               city: "",
               street: ""
             },
             name: "Main Warehouse"
           },
           orderRow: "584fbc303a3e8718364754bb",
           quantity: 10
         }
       ],
       prepayment: {
         _id: null,
         sum: 20000,
         names: [
           "PP_2"
         ],
         date: "2016-12-13T09:44:21.000Z"
       }
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

    router.get('/getFilterValues', handler.getFilterValues);

    router.get('/emails/:id', accessStackMiddleware, handler.getEmails);
    router.patch('/approve', accessStackMiddleware, handler.approve);
    router.patch('/:id', accessStackMiddleware, handler.updateOnlySelected);
    router.put('/:_id', accessStackMiddleware, function (req, res) {
        var data = {};
        var id = req.params._id;

        data.invoice = req.body;

        handler.updateInvoice(req, res, id, data);
    });
    router.post('/receive', accessStackMiddleware, handler.receive);

    router.delete('/:_id', accessStackMiddleware, function (req, res) {
        var id = req.param('_id');

        handler.removeInvoice(req, res, id);
    });

    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
