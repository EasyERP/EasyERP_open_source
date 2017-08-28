var express = require('express');
var router = express.Router();
var ChartOfAccountHandler = require('../handlers/chartOfAccount');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new ChartOfAccountHandler(models);
    var moduleId = MODULES.CHARTOFACCOUNT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'chartOfAccount', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /ChartOfAccount/ Request Chart Of Account
     *
     * @apiVersion 0.0.1
     * @apiName getChartOfAccount
     * @apiGroup Chart Of Account
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of bonusTypes which will show
     * @apiParam (?Field=value) {String} contentType="ChartOfAccount" Type of content
     *
     * @apiSuccess {Object} ChartOfAccount Chart Of Account
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "total": 51,
         "data": [
             {
                 "_id": "565eb53a6aa50532e5df0bc8",
                 "code": 100000,
                 "createdBy": {
                     "date": "2016-07-08T12:38:27.116Z",
                     "user": null
                 },
                 "editedBy": {
                     "date": "2015-12-02T14:19:59.504Z",
                     "user": "52203e707d4dba8813000003"
                 },
                 "payMethod": null,
                 "type": "Fixed Assets",
                 "name": "100000 Fixed Asset Account",
                 "account": "Fixed Asset Account"
             },
             {
                 "_id": "565eb53a6aa50532e5df0bc9",
                 "code": 101200,
                 "createdBy": {
                     "date": "2016-07-08T12:38:27.117Z",
                     "user": null
                 },
                 "editedBy": {
                     "date": "2016-05-06T10:04:35.796Z",
                     "user": "563f673270bbc2b740ce89ae"
                 },
                 "payMethod": null,
                 "type": "Current Assets",
                 "name": "101200 Account Receivable",
                 "account": "Account Receivable"
             },
             ...
         ]
     }
     */
    router.get('/', accessStackMiddleware, handler.getForView);

    /**
     *@api {get} /chartOfAccount/getForDd/ Request Chart Of Account for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getChartOfAccountForDd
     * @apiGroup Chart Of Account
     *
     * @apiSuccess {Object} ChartOfAccountForDd Chart Of Account for dropDown
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
        "data": [
            {
                "_id": "565eb53a6aa50532e5df0bc8",
                "code": 100000,
                "createdBy": {
                    "date": "2016-07-08T13:03:26.435Z",
                    "user": null
                },
                "editedBy": {
                    "date": "2015-12-02T14:19:59.504Z",
                    "user": "52203e707d4dba8813000003"
                },
                "payMethod": null,
                "type": "Fixed Assets",
                "name": "100000 Fixed Asset Account",
                "account": "Fixed Asset Account"
            },
            {
                "_id": "565eb53a6aa50532e5df0bc9",
                "code": 101200,
                "createdBy": {
                    "date": "2016-07-08T13:03:26.436Z",
                    "user": null
                },
                "editedBy": {
                    "date": "2016-05-06T10:04:35.796Z",
                    "user": "563f673270bbc2b740ce89ae"
                },
                "payMethod": null,
                "type": "Current Assets",
                "name": "101200 Account Receivable",
                "account": "Account Receivable"
            },
            ...
            ]
     }
     */
    router.get('/getForDd', handler.getForDd);

    /**
     *@api {post} /chartOfAccount/ Request for creating new Chart Of Account
     *
     * @apiVersion 0.0.1
     * @apiName createNewChartOfAccount
     * @apiGroup Chart Of Account
     *
     * @apiParamExample {json} Request-Example:
     {
         "code": 200000,
         "account": " Mixed Asset Account",
         "type": " Mixed Assets",
         "name": "200000  Mixed Asset Account"
     }
     *
     * @apiSuccess {Object} NewChartOfAccount Just created new chart Of Account
     * @apiSuccessExample Success-Response:
     HTTP/1.1 201 Created
     {
           "success": {
                 "__v": 0,
                 "code": 200000,
                 "_id": "577fa97046d1b4bf451e0bd2",
                 "createdBy": {
                   "date": "2016-07-08T13:24:00.909Z",
                   "user": null
                 },
                 "editedBy": {
                   "user": null
                 },
                 "payMethod": null,
                 "type": " Mixed Assets",
                 "name": "200000  Mixed Asset Account",
                 "account": " Mixed Asset Account"
           }
     }
     */
    router.post('/', accessStackMiddleware, handler.create);
    router.post('/createAccountType', accessStackMiddleware, handler.createAccountType);

    /**
     *@api {patch} /chartOfAccount/ Request for partly updating Chart Of Account
     *
     * @apiVersion 0.0.1
     * @apiName updateChartOfAccount
     * @apiGroup Chart Of Account
     *
     * @apiParamExample {json} Request-Example:
     [
     {
       "account": "Fixed Asset Account",
       "name": "100000 Fixed Asset Account",
       "_id": "565eb53a6aa50532e5df0bc8"
     }
     ]
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":"updated"
     }
     */
    router.patch('/', accessStackMiddleware, handler.putchBulk);
    router.delete('/:id', accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /chartOfAccount/ Request for deleting a few Charts Of Account
     *
     * @apiVersion 0.0.1
     * @apiName deleteFewChartsOfAccount
     * @apiGroup Chart Of Account
     *
     * @apiParamExample {json} Request-Example:
     {
         "contentType": "ChartOfAccount",
         "ids": [
             "565eb53a6aa50532e5df0bc9",
             "565eb53a6aa50532e5df0bca",
             "565eb53a6aa50532e5df0bcb",
             "565eb53a6aa50532e5df0bcc",
             "565eb53a6aa50532e5df0bcd"
         ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":5
     }
     */
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
