var express = require('express');
var router = express.Router();
var QuotationHandler = require('../handlers/quotation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new QuotationHandler(models, event);
    var moduleId = MODULES.ORDERS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    //var accessDeleteStackMiddleware = require('../helpers/checkDelete');


    /*function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'order');
    }*/

    router.use(authStackMiddleware);

    /**
     *@api {get} /order/ Request Orders
     *
     * @apiVersion 0.0.1
     * @apiName getOrders
     * @apiGroup Order
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Orders which will show
     * @apiParam (?Field=value) {String} contentType="order" Type of content
     *
     * @apiSuccess {Object} Orders
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
          total: 1014,
          count: 50,
          data: [
            {
              _id: "584abe3153bfade838152cea",
              salesPerson: {
                name: null
              },
              workflow: {
                _id: "55647b932e4aa3804a765ec5",
                name: "Draft/ Quotation",
                status: "New"
              },
              supplier: {
                _id: "57bacf6d4b2d7f3b4233d5c9",
                name: "Actifile "
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
              paymentInfo: {
                taxes: 0,
                unTaxed: 30000,
                total: 30000
              },
              orderDate: "2016-12-23T00:00:00.000Z",
              name: "SO_2",
              status: {
                allocateStatus: "ALL",
                fulfillStatus: "ALL",
                shippingStatus: "NOT"
              },
              removable: false,
              channel: null,
              paymentsPaid: 0,
              total: 1014
            },
        ...
          ]
}
     */
    router.get('/', accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /order/:id Request Order
     *
     * @apiVersion 0.0.1
     * @apiName getOrder
     * @apiGroup Order
     *
     * @apiParam {String} id Unique id of Order
     *
     * @apiSuccess {Object} Order
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
          _id: "578350565dc67c373fcf4a6a",
          _type: "Order",
          shopifyId: "",
          magentoId: "",
          __v: 0,
          conflictTypes: [

          ],
          editedBy: {
            date: "2016-12-12T11:26:19.230Z",
            user: {
              _id: "5797555d10343a8c275f3e70",
              login: "slava.slavutich"
            }
          },
          channel: null,
          createdBy: {
            date: "2016-07-11T07:52:54.865Z",
            user: "563b58c2ab9698be7c9df6b6"
          },
          project: {
            _id: "57690393995fc1bd201669d6",
            name: "Alalali support"
          },
          creationDate: "2016-07-11T07:52:54.865Z",
          groups: {
            group: [

            ],
            users: [

            ],
            owner: null
          },
          notes: [

          ],
          attachments: [

          ],
          whoCanRW: "everyOne",
          warehouse: {
            _id: "57dfc6ea6066337b771e99e2",
            name: "Main Warehouse"
          },
          tempWorkflow: null,
          workflow: {
            _id: "55647b932e4aa3804a765ec5",
            name: "Draft/ Quotation",
            status: "New"
          },
          shippingExpenses: {
            account: null,
            amount: 0
          },
          paymentInfo: {
            taxes: 0,
            unTaxed: 27200,
            discount: 0,
            total: 27200
          },
          priceList: null,
          costList: null,
          salesPerson: null,
          paymentTerm: null,
          destination: null,
          name: "SO_1267",
          paymentMethod: null,
          status: {
            shippingStatus: "ALL",
            fulfillStatus: "ALL",
            allocateStatus: "ALL"
          },
          integrationId: "",
          expectedDate: "2016-07-10T22:00:00.000Z",
          orderDate: "2016-12-01T13:16:11.982Z",
          supplier: {
            _id: "5735a3dde9e6c01a47f07b04",
            address: {
              country: "UAE",
              zip: "",
              state: "",
              city: "Dubai",
              street: ""
            },
            name: {
              last: "Tribak",
              first: "Karim"
            },
            fullName: "Karim Tribak",
            id: "5735a3dde9e6c01a47f07b04"
          },
          type: "Not Invoiced",
          forSales: true,
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
              _id: "5840229b7a7667d81be7f9e5",
              description: "",
              cost: 0,
              channel: null,
              creditAccount: {
                _id: "565eb53a6aa50532e5df0bc8",
                name: "100000 Fixed Asset Account"
              },
              debitAccount: {
                _id: "565eb53a6aa50532e5df0be2",
                name: "210000 Cost of Goods Sold"
              },
              creationDate: "2017-01-13T13:02:42.858Z",
              nominalCode: 0,
              subTotal: 27200,
              costPrice: 0,
              unitPrice: 27200,
              taxes: null,
              quantity: 1,
              warehouse: {
                _id: "57dfc6ea6066337b771e99e2",
                name: "Main Warehouse"
              },
              order: "578350565dc67c373fcf4a6a",
              product: {
                _id: "5840222de79000180dd6d74d",
                info: {
                  EAN: null,
                  ISBN: null,
                  UPC: null,
                  SKU: null,
                  categories: [
                    "564591f9624e48551dfe3b23"
                  ],
                  brand: null,
                  description: "",
                  barcode: "",
                  isActive: true,
                  productType: "57f36a64da7737dc08729c66"
                },
                name: "June"
              },
              inStock: 0,
              onHand: 0,
              allocated: 0,
              goodsNotes: [
                {
                  _id: "5840229f7a7667d81be7fcd9",
                  name: "SO_1267*1",
                  status: {
                    shipped: true,
                    picked: true,
                    packed: true,
                    printed: true,
                    shippedOn: "2016-07-11T08:47:08.000Z",
                    pickedOn: "2016-07-11T08:47:08.000Z",
                    packedOn: "2016-07-11T08:47:08.000Z",
                    printedOn: "2016-07-11T08:47:08.000Z"
                  },
                  order: {
                    name: "SO_1267"
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
                  orderRow: "5840229b7a7667d81be7f9e5",
                  quantity: 1
                }
              ],
              fulfilled: 1
            }
          ],
          account: {
            _id: "565eb53a6aa50532e5df0be2",
            name: "210000 Cost of Goods Sold"
          },
          goodsNotes: [
            {
              _id: "5840229f7a7667d81be7fcd9",
              name: "SO_1267*1",
              status: {
                shipped: true,
                picked: true,
                packed: true,
                printed: true,
                shippedOn: "2016-07-11T08:47:08.000Z",
                pickedOn: "2016-07-11T08:47:08.000Z",
                packedOn: "2016-07-11T08:47:08.000Z",
                printedOn: "2016-07-11T08:47:08.000Z"
              },
              order: {
                name: "SO_1267"
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
              orderRow: "5840229b7a7667d81be7f9e5",
              quantity: 1
            }
          ],
          prepayment: {

          },
          invoice: {

          }
}
     */
    router.get('/:id', handler.getById);

    /**
     *@api {get} /order/ Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Order
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
         {
           _id: null,
           Orderdate: [
             "2016-12-01T13:05:19.000Z",
             "2016-12-01T11:22:09.000Z",
             "2016-12-01T11:19:59.000Z",
             ...
           ]
         }
     ]
     */
    router.get('/getFilterValues', handler.getFilterValues);

    router.patch('/:id', accessStackMiddleware, handler.putchModel);

    router.delete('/:id', accessStackMiddleware, /*accessDeleteStackMiddlewareFunction,*/ handler.remove);

    return router;
};
