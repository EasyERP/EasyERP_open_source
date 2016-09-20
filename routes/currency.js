var express = require('express');
var router = express.Router();
var CurrencyHandler = require('../handlers/currency');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new CurrencyHandler(models);

    /**
     *@api {get} /currency/getForDd/ Request for getting currency for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getCurrenciesForDd
     * @apiGroup Currency
     *
     * @apiSuccess {Object} Currencies Currencies for Dd
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
 {
     "data": [
         {
             "_id": "565eab29aeb95fa9c0f9df2d",
             "sequence": 0,
             "name": "USD"
         },
         {
             "_id": "565eab34aeb95fa9c0f9df2e",
             "sequence": 1,
             "name": "EUR"
         },
         {
             "_id": "565eab3faeb95fa9c0f9df2f",
             "sequence": 2,
             "name": "UAH"
         }
     ]
 }
     */
    router.get('/getForDD', authStackMiddleware, handler.getForDd);
    router.get('/getAll', authStackMiddleware, handler.getAll);
    router.get('/getForList', handler.getForList);
    router.put('/:id', handler.update);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);

    return router;
};
