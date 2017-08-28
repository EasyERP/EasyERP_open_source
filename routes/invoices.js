var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoices');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new InvoiceHandler(models, event);
    var moduleId = MODULES.INVOICE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'invoice', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /invoice/ Request Invoices
     *
     * @apiVersion 0.0.1
     * @apiName getInvoices
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Invoices which will show
     *
     * @apiParam (?Field=value) {String} filter-forSales-key="forSales" Property of filter object
     * @apiParam (?Field=value) {String} filter-forSales-type="Boolean" Property of filter object
     * @apiParam (?Field=value) {String[]} filter-forSales-value='["true"]' Property of filter object
     *
     * @apiParam (?Field=value) {String} contentType="invoice" Type of content
     * @apiParam (?Field=value) {Boolean} forSales=true Type of content
     *
     * @apiSuccess {Object} Invoices Fetched Invoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       total: 19,
       data: [
         {
           _id: "572cac51265f2548392c9133",
           total: 19,
           salesPerson: {
             name: "Oleg Ostroverkh",
             _id: "55b92ad221e4b7c40f00004a"
           },
           workflow: {
             _id: "5555e570671a8b6800000003",
             status: "In Progress",
             name: "Partially Paid"
           },
           supplier: {
             _id: "55cf4f834a91e37b0b000102",
             name: "SharperBuilds "
           },
           project: {
             _id: "5613b6f0c90e2fb026ce068c"
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
             _id: "565ef6ba270f53d02ee71d65",
             name: "Invoice Journal"
           },
           paymentInfo: {
             balance: 476200,
             unTaxed: 1635200,
             taxes: 0,
             total: 1635200
           },
           invoiceDate: "2016-05-05T22:00:00.000Z",
           name: "PO1006",
           paymentDate: "2016-03-10T04:00:00.000Z",
           dueDate: "2016-05-10T22:00:00.000Z",
           approved: true,
           removable: false,
           paid: 11590,
           editedBy: {
             date: "2016-12-12T12:59:11.493Z"
           }
         },
         ...
       ]
     }
     */

    /**
     *@api {get} /invoice/ Request out of dueDate Invoices
     *
     * @apiVersion 0.0.1
     * @apiName getOutOfDateInvoices
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} count=5 Count of Invoices which will show
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate], pastDue:true)
     *
     * @apiParam (?Field=value) {String} contentType="invoice" Type of content
     * @apiParam (?Field=value) {Boolean} forSales=true Type of content
     * @apiParam (?Field=value) {Object} sort="{invoiceDate: -1}" Sort Object by invoiceDate
     *
     * @apiSuccess {Object} OutOfDateInvoices Fetched Invoices
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
      "total": 1,
      "data": [
        {
          "_id": "58400677a5524a7b0d615b0b",
          "total": 1,
          "salesPerson": {
            "name": null
          },
          "workflow": {
            "_id": "55647d932e4aa3804a765ec9",
            "name": "Unpaid",
            "status": "New"
          },
          "supplier": {
            "_id": "57d6a0e82a9f9ddd3374a308",
            "name": "Kim Larking"
          },
          "project": {
            "_id": "57d6a13d8983d7c23376e660"
          },
          "currency": {
            "rate": 0.9412,
            "_id": {
              "_id": "565eab34aeb95fa9c0f9df2e",
              "sequence": 1,
              "symbol": "€",
              "name": "EUR"
            }
          },
          "journal": {
            "_id": "565ef6ba270f53d02ee71d65",
            "name": "Invoice Journal"
          },
          "paymentInfo": {
            "taxes": 0,
            "discount": 0,
            "unTaxed": 75000,
            "balance": 75000,
            "total": 75000
          },
          "invoiceDate": "2016-11-30T23:00:00.000Z",
          "name": "SO_246",
          "dueDate": "2016-12-09T23:00:00.000Z",
          "approved": true,
          "removable": true,
          "paid": 0,
          "editedBy": {
            "date": "2016-12-01T11:18:21.906Z"
          }
        }
      ]
}
     */

    /**
     *@api {get} /invoice/ Request Invoice
     *
     * @apiVersion 0.0.1
     * @apiName getInvoice
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {String} viewType="form" Type of View
     * @apiParam (?Field=value) {String} id of Invoice
     * @apiParam (?Field=value) {String} forSales="true" Is for sales or not
     *
     * @apiSuccess {Object} Invoice
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
  "_id": "572cac51265f2548392c9133",
  "_type": "Invoices",
  "paymentDate": "2016-03-10T04:00:00.000Z",
  "__v": 0,
  "products": [
    {
      "_id": "5840229b7a7667d81be7f8b9",
      "description": "",
      "cost": 0,
      "channel": null,
      "creditAccount": {
        "_id": "565eb53a6aa50532e5df0bc8",
        "name": "100000 Fixed Asset Account"
      },
      "debitAccount": {
        "_id": "565eb53a6aa50532e5df0be2",
        "name": "210000 Cost of Goods Sold"
      },
      "creationDate": "2017-01-13T14:51:23.168Z",
      "nominalCode": 0,
      "subTotal": 1635200,
      "costPrice": 0,
      "unitPrice": 1635200,
      "taxes": null,
      "quantity": 1,
      "warehouse": {
        "_id": "57dfc6ea6066337b771e99e2",
        "name": "Main Warehouse"
      },
      "order": "5718de9f5a8fd45520aa1667",
      "product": {
        "_id": "5840222de79000180dd6d5e9",
        "info": {
          "EAN": null,
          "ISBN": null,
          "UPC": null,
          "SKU": null,
          "categories": [
            "564591f9624e48551dfe3b23"
          ],
          "brand": null,
          "description": "",
          "barcode": "",
          "isActive": true,
          "productType": "57f36a64da7737dc08729c66"
        },
        "name": "01.12.15-30.04.16 second part"
      },
      "inStock": 0,
      "onHand": 0,
      "allocated": 0,
      "goodsNotes": [
        {
          "_id": "584022a07a7667d81be7fdf2",
          "name": "SO_996*1",
          "status": {
            "shipped": true,
            "picked": true,
            "packed": true,
            "printed": true,
            "shippedOn": "2016-02-28T04:00:00.000Z",
            "pickedOn": "2016-02-28T04:00:00.000Z",
            "packedOn": "2016-02-28T04:00:00.000Z",
            "printedOn": "2016-02-28T04:00:00.000Z"
          },
          "order": {
            "name": "SO_996"
          },
          "warehouse": {
            "_id": "57dfc6ea6066337b771e99e2",
            "__v": 0,
            "account": "5788b4be52adaf4c49e4b51c",
            "editedBy": {
              "date": "2016-12-01T13:14:05.155Z",
              "user": null
            },
            "createdBy": {
              "date": "2016-12-01T13:14:05.124Z",
              "user": null
            },
            "main": true,
            "isOwn": true,
            "address": {
              "country": "",
              "zip": "",
              "state": "",
              "city": "",
              "street": ""
            },
            "name": "Main Warehouse"
          },
          "orderRow": "5840229b7a7667d81be7f8b9",
          "quantity": 1
        }
      ],
      "fulfilled": 1
    }
  ],
  "dueDate": "2016-05-10T22:00:00.000Z",
  "reconcile": false,
  "integrationId": "",
  "project": {
    "_id": "5613b6f0c90e2fb026ce068c",
    "paymentMethod": "565f2e05ab70d49024242e07"
  },
  "emailed": false,
  "approved": true,
  "removable": false,
  "invoiced": false,
  "notes": [
    {
      "note": "comment test",
      "_id": "584e9f1fbc2278c0302f72bb",
      "date": "2016-12-12T12:59:11.493Z",
      "user": {
        "_id": "5849743af6af9b6178e67e99",
        "login": "superAdmin"
      }
    }
  ],
  "attachments": [
    {
      "uploaderName": "ivan.pasichnyuk",
      "uploadDate": "2016-05-06T14:38:08.741Z",
      "size": "0.053&nbsp;Mb",
      "shortPas": "uploads%2Finvoices%2F572cac51265f2548392c9133%2FiTacit%20Invoice%20V%201.0%20Complete.%20Nov%2023-Feb%2019.pdf",
      "name": "iTacit Invoice V 1.0 Complete. Nov 23-Feb 19.pdf",
      "_id": "572cac504b6e6975397be711"
    }
  ],
  "channel": null,
  "editedBy": {
    "date": "2016-12-12T12:59:11.493Z",
    "user": {
      "_id": "5849743af6af9b6178e67e99",
      "login": "superAdmin"
    }
  },
  "createdBy": {
    "date": "2016-04-21T14:07:27.168Z",
    "user": {
      "_id": "57231ce22387d7b821a694c2",
      "login": "ivan.pasichnyuk"
    }
  },
  "creationDate": "2016-04-21T14:07:27.168Z",
  "groups": {
    "group": [

    ],
    "users": [

    ],
    "owner": {
      "_id": "560c099da5d4a2e20ba5068b",
      "login": "AlexSvatuk"
    }
  },
  "whoCanRW": "everyOne",
  "workflow": {
    "_id": "5555e570671a8b6800000003",
    "status": "In Progress",
    "name": "Partially Paid"
  },
  "payments": [

  ],
  "paymentInfo": {
    "taxes": 0,
    "discount": 0,
    "unTaxed": 1635200,
    "balance": 476200,
    "total": 1635200
  },
  "paymentMethod": null,
  "paymentTerms": null,
  "salesPerson": "55b92ad221e4b7c40f00004a",
  "currency": {
    "rate": 1,
    "_id": {
      "_id": "USD",
      "active": true,
      "decPlace": 2,
      "symbol": "$",
      "name": "USD"
    }
  },
  "journal": {
    "_id": "565ef6ba270f53d02ee71d65",
    "name": "Invoice Journal"
  },
  "invoiceDate": "2016-05-05T22:00:00.000Z",
  "paymentReference": "PO1006",
  "sourceDocument": {
    "_id": "5718de9f5a8fd45520aa1667",
    "name": "SO_996",
    "orderDate": "2016-02-28T04:00:00.000Z"
  },
  "supplier": {
    "_id": "55cf4f834a91e37b0b000102",
    "address": {
      "country": "Canada",
      "zip": "B3B 1T4",
      "state": "NS",
      "city": "Dartmouth",
      "street": "61 Raddall Avenue"
    },
    "name": {
      "last": "",
      "first": "SharperBuilds"
    },
    "fullName": "SharperBuilds ",
    "id": "55cf4f834a91e37b0b000102"
  },
  "forSales": true,
  "name": "PO1006",
  "id": "572cac51265f2548392c9133",
  "account": {
    "_id": "565eb53a6aa50532e5df0be2",
    "name": "210000 Cost of Goods Sold"
  },
  "goodsNotes": [
    {
      "_id": "584022a07a7667d81be7fdf2",
      "name": "SO_996*1",
      "status": {
        "shipped": true,
        "picked": true,
        "packed": true,
        "printed": true,
        "shippedOn": "2016-02-28T04:00:00.000Z",
        "pickedOn": "2016-02-28T04:00:00.000Z",
        "packedOn": "2016-02-28T04:00:00.000Z",
        "printedOn": "2016-02-28T04:00:00.000Z"
      },
      "order": {
        "name": "SO_996"
      },
      "warehouse": {
        "_id": "57dfc6ea6066337b771e99e2",
        "__v": 0,
        "account": "5788b4be52adaf4c49e4b51c",
        "editedBy": {
          "date": "2016-12-01T13:14:05.155Z",
          "user": null
        },
        "createdBy": {
          "date": "2016-12-01T13:14:05.124Z",
          "user": null
        },
        "main": true,
        "isOwn": true,
        "address": {
          "country": "",
          "zip": "",
          "state": "",
          "city": "",
          "street": ""
        },
        "name": "Main Warehouse"
      },
      "orderRow": "5840229b7a7667d81be7f8b9",
      "quantity": 1
    }
  ],
  "prepayment": {

  }
}
     */

    /**
     *@api {get} /invoice/ Request Invoices by date filter
     *
     * @apiVersion 0.0.1
     * @apiName getInvoicesByDate
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} count=5 Count of Invoices which will show
     *
     * @apiParam  (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="true" is for sales or not
     *
     * @apiParam (?Field=value) {String} contentType="invoice" Type of content
     * @apiParam (?Field=value) {Object} sort="{invoiceDate=-1}" Sort object by invoiceDate
     *
     * @apiSuccess {Object} Invoices Fetched Invoices from som period of time
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "total": 2,
       "data": [
         {
           "_id": "5861251b36148244359de7b4",
           "total": 2,
           "salesPerson": {
             "name": null
           },
           "workflow": {
             "_id": "55647d932e4aa3804a765ec9",
             "name": "Unpaid",
             "status": "New"
           },
           "supplier": {
             "_id": "57a8a926c2bdd8bf07e54a3c",
             "name": "Abdul Abu"
           },
           "currency": {
             "rate": 1,
             "_id": {
               "_id": "USD",
               "name": "USD",
               "decPlace": 2,
               "symbol": "$",
               "active": true
             }
           },
           "journal": {
             "_id": "565ef6ba270f53d02ee71d65",
             "name": "Invoice Journal"
           },
           "paymentInfo": {
             "taxes": 1000,
             "discount": 0,
             "unTaxed": 10000,
             "balance": 11000,
             "total": 11000
           },
           "invoiceDate": "2016-12-25T21:00:00.000Z",
           "name": "SI6",
           "approved": false,
           "removable": true,
           "paid": 0,
           "editedBy": {
             "date": "2016-12-26T14:11:37.668Z"
           }
         },
         {
           "_id": "58400677a5524a7b0d615b0b",
           "total": 2,
           "salesPerson": {
             "name": null
           },
           "workflow": {
             "_id": "55647d932e4aa3804a765ec9",
             "name": "Unpaid",
             "status": "New"
           },
           "supplier": {
             "_id": "57d6a0e82a9f9ddd3374a308",
             "name": "Kim Larking"
           },
           "project": {
             "_id": "57d6a13d8983d7c23376e660"
           },
           "currency": {
             "rate": 0.9412,
             "_id": {
               "_id": "565eab34aeb95fa9c0f9df2e",
               "sequence": 1,
               "symbol": "€",
               "name": "EUR"
             }
           },
           "journal": {
             "_id": "565ef6ba270f53d02ee71d65",
             "name": "Invoice Journal"
           },
           "paymentInfo": {
             "taxes": 0,
             "discount": 0,
             "unTaxed": 75000,
             "balance": 75000,
             "total": 75000
           },
           "invoiceDate": "2016-11-30T23:00:00.000Z",
           "name": "SO_246",
           "dueDate": "2016-12-09T23:00:00.000Z",
           "approved": true,
           "removable": true,
           "paid": 0,
           "editedBy": {
             "date": "2016-12-01T11:18:21.906Z"
           }
         }
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
     *@api {get} /invoice/getFilterValues Request Filter values
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Invoices
     *
     * @apiSuccess {Array} FilterValues
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           "_id": null,
           "Due date": [
             "2016-12-14T23:00:00.000Z",
             "2016-11-27T23:00:00.000Z",
             "2016-10-30T23:00:00.000Z",
             ...
           ]
         }
     ]
     * */
    router.get('/getFilterValues', handler.getFilterValues);

    router.get('/emails/:id', accessStackMiddleware, handler.getEmails);
    router.get('/stats', accessStackMiddleware, handler.getStats);
    router.get('/invoiceByWeek', accessStackMiddleware, handler.invoiceByWeek);

    /**
     *@api {get} /invoice/revenueBySales Request revenueBySales
     *
     * @apiVersion 0.0.1
     * @apiName getRevenueForSales
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="true" is for sales
     *
     * @apiSuccess {Array} revenueForSales
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           _id: "Empty",
           sum: 203000
         },
         {
           _id: "Olga Sikora",
           sum: 79685.50786230344
         }
     ]
     * */

    /**
     *@api {get} /invoice/revenueBySales Request revenueBySales (second variant for purchase)
     *
     * @apiVersion 0.0.1
     * @apiName getRevenueForPurchase
     * @apiGroup purchaseInvoices
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="false" isn't for sales
     *
     * @apiSuccess {Array} revenueForPurchase
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           "_id": "Empty",
           "sum": 122000
         }
     ]
     * */
    router.get('/revenueBySales', accessStackMiddleware, handler.revenueBySales);

    /**
     *@api {get} /invoice/revenueByCountry Request revenueByCountry
     *
     * @apiVersion 0.0.1
     * @apiName getRevenueByCountry
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="true" is for sales or not
     *
     * @apiSuccess {Array} revenueByCountry
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           "_id": "",
           "sum": 11000
         },
         {
           "_id": null,
           "sum": 192000
         },
         {
           "_id": "Select",
           "sum": 79685.50786230344
         }
     ]
     * */

    /**
     *@api {get} /invoice/revenueByCountry Request revenueByCountry(purchase Variant)
     *
     * @apiVersion 0.0.1
     * @apiName getRevenueByCountry(Purchase)
     * @apiGroup purchaseInvoices
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="false" is for sales or not
     *
     * @apiSuccess {Array} revenueByCountry(Purchase)
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           "_id": null,
           "sum": 122000
         }
     ]
     * */
    router.get('/revenueByCountry', accessStackMiddleware, handler.revenueByCountry);

    /**
     *@api {get} /invoice/revenueByCustomer Request revenueByCustomer
     *
     * @apiVersion 0.0.1
     * @apiName getRevenueByCustomer
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="true" is for sales or not
     *
     * @apiSuccess {Array} revenueByCustomer
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           _id: "Abdul Abu",
           sum: 11000
         },
         {
           _id: null,
           sum: 192000
         },
         {
           _id: "Kim Larking",
           sum: 79685.50786230344
         }
     ]
     * */

    /**
     *@api {get} /invoice/revenueByCustomer Request revenueByCustomer(purchase Variant)
     *
     * @apiVersion 0.0.1
     * @apiName getRevenueByCustomer(Purchase)
     * @apiGroup purchaseInvoices
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="false" is for sales or not
     *
     * @apiSuccess {Array} revenueByCustomer(Purchase)
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           "_id": null,
           "sum": 122000
         }
     ]
     * */
    router.get('/revenueByCustomer', accessStackMiddleware, handler.revenueByCustomer);
    router.get('/getRevenueForSingle', accessStackMiddleware, handler.getRevenueForSingle);

    /**
     *@api {get} /invoice/getInvoiceByWorkflows Request InvoicesByWorkflows
     *
     * @apiVersion 0.0.1
     * @apiName getInvoicesByWorkflows
     * @apiGroup Invoices
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} count=5 Count of Invoices which will show
     *
     * @apiParam  (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="true" is for sales or not
     *
     * @apiParam (?Field=value) {String} contentType="invoice" Type of content
     * @apiParam (?Field=value) {Object} sort="{invoiceDate=-1}" Sort object by invoiceDate
     *
     * @apiSuccess {Array} InvoicesByWorkflows
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           _id: "573db03b782445233dbe6835",
           total: 1920,
           name: "Cancelled",
           count: 1
         },
         {
           _id: "55647d932e4aa3804a765ec9",
           total: 906.8550786230344,
           name: "Unpaid",
           count: 2
         }
     ]
     * */

    /**
     *@api {get} /invoice/getInvoiceByWorkflows Request PurchaseInvoicesByWorkflows
     *
     * @apiVersion 0.0.1
     * @apiName getPurchaseInvoicesByWorkflows
     * @apiGroup purchaseInvoices
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} count=5 Count of Invoices which will show
     *
     * @apiParam  (?Field=value) {Object} filter="{date: {value: [Thu Dec 01 2016 00:00:00 GMT+0200 (EET), Sat Dec 31 2016 00:00:00 GMT+0200 (EET)]}}" filter during some period of time([startDate, endDate])
     * @apiParam (?Field=value) {Boolean} forSales="false" is for sales or not
     *
     * @apiParam (?Field=value) {String} contentType="purchaseInvoices" Type of content
     * @apiParam (?Field=value) {Object} sort="{invoiceDate=-1}" Sort object by invoiceDate
     *
     * @apiSuccess {Array} PurchaseInvoicesByWorkflows
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           "_id": "55647d982e4aa3804a765ecb",
           "total": 121,
           "name": "Paid",
           "count": 2
         },
         {
           "_id": "5555e54c6a3f01acae0b5564",
           "total": 0,
           "name": "Draft",
           "count": 6
         },
         {
           "_id": "55647d932e4aa3804a765ec9",
           "total": 1099,
           "name": "Unpaid",
           "count": 6
         }
     ]
     * */
    router.get('/getInvoiceByWorkflows', accessStackMiddleware, handler.getInvoiceByWorkflows);
    router.get('/getSalesByCountry', handler.getSalesByCountry);


    /**
     *@api {get} /invoice/getSalesByCountry Request SalesByCountry
     *
     * @apiVersion 0.0.1
     * @apiName getSalesByCountry
     * @apiGroup Invoice
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: ["Sun Jan 01 2017 00:00:00 GMT+0200 (EET)","Tue Jan 31 2017 00:00:00 GMT+0200 (EET)"]}, forSales: {key:"forSales", type:"boolean", value:["true"]}}"
     * @apiParam (?Field=value) {Boolean} forSales="true" Flag - is for sales or not?
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

    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
