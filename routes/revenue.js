var express = require('express');
var router = express.Router();
var RevenueHandler = require('../handlers/revenue');

var expressSession = require('../handlers/expressSession');

module.exports = function (models) {
    var handler = new RevenueHandler(models);

    router.get('/bySales', expressSession.authenticatedUser, handler.bySales);
    router.get('/byDepartment', expressSession.authenticatedUser, handler.byDepartment);
    router.get('/paidwtrack', expressSession.authenticatedUser, handler.paidwtrack);
    router.get('/unpaidwtrack', expressSession.authenticatedUser, handler.unpaidwtrack);
    router.get('/cancelledWtrack', expressSession.authenticatedUser, handler.cancelledWtrack);
    router.get('/projectBySales', expressSession.authenticatedUser, handler.projectBySales);
    router.get('/employeeBySales', expressSession.authenticatedUser, handler.employeeBySales);

    router.get('/getFromCash', expressSession.authenticatedUser, handler.getFromCash);
    router.get('/hoursByDep', expressSession.authenticatedUser, handler.hoursByDep);

    router.get('/allBonusBySales/:byContent', expressSession.authenticatedUser, handler.allBonusBySales);
    router.get('/uncalcBonus', expressSession.authenticatedUser, handler.uncalcBonus);
    router.get('/calcBonus', expressSession.authenticatedUser, handler.calcBonus);

    /**
     *@api {get} /revenue/synthetic/ Request Synthetic
     *
     * @apiVersion 0.0.1
     * @apiName getSynthetic
     * @apiGroup Revenue
     *
     * @apiSuccess {Object} Synthetic
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "payments": [
        {
          "sales": [
            {
              "salesPerson": "55b92ad221e4b7c40f00004a",
              "invoicedBySales": 868400
            }
          ],
          "salesArray": [
            {
              "_id": "5602a01550de7f4138000008",
              "name": {
                "last": "Dufynets",
                "first": "Yana"
              }
            },
            {
              "_id": "560264bb8dc408c632000005",
              "name": {
                "last": "Lyakh",
                "first": "Anastas"
              }
            },
            ...
          ],
          "suppliersArray": [
            {
              "_id": "575988b67f3384556ae3d100",
              "name": {
                "last": "Israel",
                "first": "Alexander"
              }
            },
            {
              "_id": "56a0d53b62d172544baf0e3c",
              "name": {
                "last": "Liden",
                "first": "Ivar"
              }
            },
            ...
          ],
          "suppliers": [
            {
              "supplier": "574816b3c8a63a5268a46a96",
              "invoicedBySupplier": 473200
            },
            {
              "supplier": "5745ad3dd39187372d0c339c",
              "invoicedBySupplier": 395200
            }
          ],
          "date": 201408,
          "invoiced": 868400,
          "paidBySales": [
            {
              "salesPerson": "55b92ad221e4b7c40f00004a",
              "paidBySales": 473200
            }
          ],
          "paid": 473200
        },
        ...
        ]
]
     * */
    router.get('/synthetic', expressSession.authenticatedUser, handler.synthetic);

    /**
     *@api {get} /revenue/totalInvoiceBySales/ Request TotalInvoiceBySales
     *
     * @apiVersion 0.0.1
     * @apiName getTotalInvoiceBySales
     * @apiGroup Revenue
     *
     * @apiParam (?Field=value) {Object} filter="{date: {value: ["Sun Jan 01 2017 00:00:00 GMT+0200 (EET)","Tue Jan 31 2017 00:00:00 GMT+0200 (EET)"]}}" Filter object of period of time
     *
     * @apiSuccess {Object} totalInvoiceBySales
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": "55b92ad221e4b7c40f00009b",
            "payment": 92400,
            "name": "Larysa Popp"
        },
        ...
    ]
}
     * */
    router.get('/totalInvoiceBySales', expressSession.authenticatedUser, handler.totalInvoiceBySales);

    router.get('/profit/:byContent', expressSession.authenticatedUser, handler.profit);

    return router;
};
