var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/order');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.PURCHASEORDERS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);


    /**
     *@api {get} /purchaseOrders/ Request purchaseOrders
     *
     * @apiVersion 0.0.1
     * @apiName getPurchaseOrders
     * @apiGroup purchaseOrders
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of purchaseOrders which will show
     * @apiParam (?Field=value) {String} contentType="purchaseOrders" Type of content
     * @apiParam (?Field=value) {Object} filter="{ forSales: { key: 'forSales', type: 'boolean', value: [ 'false' ] } }" Type of content
     *
     * @apiSuccess {Object} purchaseOrders
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "total": 2,
       "count": 2,
       "data": [
         {
           "_id": "584fbc303a3e8718364754b5",
           "salesPerson": {
             "_id": "55f9298456f79c9c0c000006",
             "name": "Viktor Manhur"
           },
           "workflow": {
             "_id": "56599347bfd103f108eb4caa",
             "status": "Done",
             "name": "Invoiced received"
           },
           "supplier": {
             "_id": "57a0432fa12c299d1cdc8feb",
             "name": "Test Test"
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
           "paymentInfo": {
             "taxes": 0,
             "unTaxed": 49500,
             "total": 49500
           },
           "orderDate": "2016-12-13T00:00:00.000Z",
           "name": "PO_2",
           "status": {
             "allocateStatus": "NOA",
             "fulfillStatus": "NOA",
             "shippingStatus": "NOT"
           },
           "removable": false,
           "channel": null,
           "paymentsPaid": 20000,
           "total": 2
         },
         {
           "_id": "584aaafff63ec439398b6a64",
           "salesPerson": {
             "name": null
           },
           "workflow": {
             "_id": "5555bf276a3f01acae0b5561",
             "status": "Pending",
             "name": "Pending PO"
           },
           "supplier": {
             "_id": "57bacf6d4b2d7f3b4233d5c9",
             "name": "Actifile "
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
           "paymentInfo": {
             "taxes": 0,
             "unTaxed": 200000,
             "total": 200000
           },
           "orderDate": "2016-12-09T00:00:00.000Z",
           "name": "PO_1",
           "status": {
             "allocateStatus": "ALL",
             "fulfillStatus": "ALL",
             "shippingStatus": "NOT"
           },
           "removable": false,
           "channel": null,
           "paymentsPaid": 0,
           "total": 2
         }
       ]
     }
     */
    router.get('/', accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /purchaseOrders/:id Request purchaseOrder
     *
     * @apiVersion 0.0.1
     * @apiName getPurchaseOrder
     * @apiGroup purchaseOrders
     *
     * @apiSuccess {Object} purchaseOrder
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
          _id: "5878df114573d1846774d0d3",
          _type: "purchaseOrders",
          __v: 0,
          conflictTypes: [

          ],
          editedBy: {
            date: "2017-01-13T14:07:13.747Z",
            user: {
              _id: "5836ec22d291dd500cf6e16a",
              login: "testAdmin"
            }
          },
          channel: null,
          createdBy: {
            date: "2017-01-13T14:07:13.747Z",
            user: "5836ec22d291dd500cf6e16a"
          },
          project: null,
          creationDate: "2017-01-13T14:07:13.747Z",
          groups: {
            group: [

            ],
            users: [

            ],
            owner: null
          },
          notes: [
            {
              date: "2017-01-13T14:07:13.864Z",
              history: {
                newValue: "Pending PO",
                changedField: "Status",
                collectionName: "ORDER",
                contentId: "5878df114573d1846774d0d3",
                date: "2017-01-13T14:07:13.864Z"
              }
            },
            {
              date: "2017-01-13T14:07:13.864Z",
              history: {
                prevValue: null,
                newValue: "2017-01-12T22:00:00.000Z",
                changedField: "Payment Due Date",
                collectionName: "ORDER",
                contentId: "5878df114573d1846774d0d3",
                date: "2017-01-13T14:07:13.864Z"
              }
            },
            {
              date: "2017-01-13T14:07:13.864Z",
              history: {
                prevValue: null,
                newValue: "NOT",
                changedField: "Fulfilled",
                collectionName: "ORDER",
                contentId: "5878df114573d1846774d0d3",
                date: "2017-01-13T14:07:13.864Z"
              }
            },
            {
              date: "2017-01-13T14:07:13.864Z",
              history: {
                prevValue: null,
                newValue: "2017-01-13T14:07:13.000Z",
                changedField: "Order Date",
                collectionName: "ORDER",
                contentId: "5878df114573d1846774d0d3",
                date: "2017-01-13T14:07:13.864Z"
              }
            },
            {
              date: "2017-01-13T14:07:13.864Z",
              history: {
                prevValue: null,
                newValue: "2017-01-13T14:07:13.747Z",
                changedField: "Creation Date",
                collectionName: "ORDER",
                contentId: "5878df114573d1846774d0d3",
                date: "2017-01-13T14:07:13.864Z"
              }
            }
          ],
          attachments: [

          ],
          whoCanRW: "everyOne",
          warehouse: {
            _id: "584a9a81e6fb1adb383f2142",
            name: "Demo"
          },
          tempWorkflow: null,
          workflow: {
            _id: "5555bf276a3f01acae0b5561",
            status: "Pending",
            name: "Pending PO"
          },
          shippingExpenses: {
            account: null,
            amount: 0
          },
          paymentInfo: {
            taxes: 0,
            unTaxed: 2000,
            discount: 0,
            total: 2000
          },
          priceList: null,
          costList: null,
          salesPerson: null,
          paymentTerm: null,
          destination: null,
          name: "PO_32",
          paymentMethod: null,
          status: {
            shippingStatus: "NOR",
            fulfillStatus: "NOT",
            allocateStatus: "NOR"
          },
          integrationId: "",
          expectedDate: "2017-01-12T22:00:00.000Z",
          orderDate: "2017-01-13T14:07:13.000Z",
          supplier: {
            _id: "5878dc64ac4f17e81bcd8289",
            address: {
              country: "United States",
              zip: "36258",
              state: "",
              city: "Taxacity",
              street: "acaca"
            },
            name: {
              last: "dog",
              first: "hot"
            },
            fullName: "hot dog",
            id: "5878dc64ac4f17e81bcd8289"
          },
          type: "Not Ordered",
          forSales: false,
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
          products: [
            {
              _id: "5878df114573d1846774d0d9",
              taxCode: null,
              description: "ERP",
              totalTaxes: 0,
              channel: null,
              creditAccount: null,
              debitAccount: {
                _id: "565eb53a6aa50532e5df0bca",
                name: "101400 Erste USD"
              },
              creationDate: "2017-01-13T14:07:43.145Z",
              nominalCode: 0,
              subTotal: 2000,
              costPrice: null,
              unitPrice: 2000,
              taxes: [
                {
                  tax: 0,
                  taxCode: null
                }
              ],
              quantity: 1,
              warehouse: {
                _id: "584a9a81e6fb1adb383f2142",
                name: "Demo"
              },
              order: "5878df114573d1846774d0d3",
              product: {
                _id: "5878dc5dac4f17e81bcd8228",
                info: {
                  EAN: null,
                  ISBN: null,
                  UPC: null,
                  SKU: "svsvd1",
                  categories: [
                    "564591f9624e48551dfe3b23"
                  ],
                  brand: null,
                  description: "ERP product",
                  barcode: "",
                  isActive: true,
                  productType: "58453a4afc8d676a511283d0"
                },
                name: "ERP"
              },
              goodsNotes: [

              ],
              fulfilled: 0
            }
          ],
          account: null,
          goodsNotes: [

          ],
          prepayment: {

          },
          invoice: {

          }
}
     */
    router.get('/:id', handler.getById);

    router.post('/', handler.create);

    router.patch('/:id', handler.putchModel);

    router.delete('/:id', handler.remove);

    router.delete('/', handler.bulkRemove);

    return router;
};
