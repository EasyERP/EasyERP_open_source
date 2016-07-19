var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    /**
     *@api {get} /supplier/ Request Suppliers
     *
     * @apiVersion 0.0.1
     * @apiName getSuppliers
     * @apiGroup Supplier
     *
     * @apiSuccess {Object} Suppliers
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [
        {
          "_id": "572c750c7ae8db5b4e0b854a",
          "name": {
            "last": "",
            "first": "End User"
          },
          "fullName": "End User ",
          "id": "572c750c7ae8db5b4e0b854a"
        },
        ...
      ]
}
     */
    router.get('/', authStackMiddleware, handler.getSuppliersForDD);

    /**
     *@api {get} /supplier/getFilterValues/ Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Supplier
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": null,
         "name": {
             "displayName": "Name",
             "values": [
                 {
                     "name": "#Play",
                     "_id": "55ba0301d79a3a343900000d"
                 },
                 {
                     "name": "1Kubator",
                     "_id": "5773d14013df70de0fb65935"
                 },
                 ...
             ]
         },
         "country": {
             "displayName": "Country",
             "values": [
                 "Austria",
                 "Australia",
                 "Belgium",
                 "Canada",
                 "England",
                 "France",
                  ...
             ]
         },
         "services": {
             "displayName": "Services",
             "values": [
                 {
                     "displayName": "Supplier",
                     "_id": "isSupplier"
                 },
                 {
                     "displayName": "Customer",
                     "_id": "isCustomer"
                 }
             ]
         }
     }
]
     */
    router.get('/getFilterValues', authStackMiddleware, handler.getFilterValues);

    return router;
};
