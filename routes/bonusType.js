var BonusTypeHandler = require('../handlers/bonusType');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new BonusTypeHandler(models);
    var moduleId = MODULES.BONUSTYPE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'bonusType', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /bonusType/ Request Bonus Types
     *
     * @apiVersion 0.0.1
     * @apiName getBonusTypes
     * @apiGroup BonusType
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of bonusTypes which will show
     * @apiParam (?Field=value) {String} contentType="bonusType" Type of content
     *
     * @apiSuccess {Object} BonusTypes Bunus Types
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "total": 11,
  "data": [
    {
      "_id": "55b92ad521e4b7c40f000602",
      "isPercent": true,
      "value": 8,
      "name": "Sales/Head 8%",
      "ID": 2,
      "__v": 0,
      "bonusType": "Sales"
    },
    {
      "_id": "55b92ad521e4b7c40f000603",
      "isPercent": true,
      "value": 6,
      "name": "Sales/Usual 6%",
      "ID": 3,
      "__v": 0,
      "bonusType": "Sales"
    },
    ...
  ]
}
     */
    router.get('/', accessStackMiddleware, handler.getList);

    /**
     *@api {get} /bonusType/getForDD/ Request Bonus Types for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getBonusTypesForDropDown
     * @apiGroup BonusType
     *
     * @apiSuccess {Object} BonusTypes Bunus Types for dropDown
     * @apiSuccessExample Success-Response:
HTTP/1.1 304 Not Modified
{
    "data": [
     {
       "_id": "55b92ad521e4b7c40f00060b",
       "name": "PM Base/Junior"
     },
     {
       "_id": "55b92ad521e4b7c40f00060a",
       "name": "PM Junior/Usual 1.5%"
     },
     {
       "_id": "55b92ad521e4b7c40f000609",
       "name": "Sales/Head 10%"
     },
     {
       "_id": "55b92ad521e4b7c40f000602",
       "name": "Sales/Head 8%"
     },
     ...
    ]
}
     */
    router.get('/getForDD', handler.getForDD);

    /**
     *@api {post} /bonusType/ Request for creating Bonus Type
     *
     * @apiVersion 0.0.1
     * @apiName createNewBonusType
     * @apiGroup BonusType
     *
     * @apiParamExample {json} Request-Example:
{
    "name": "Sales/Head 10%",
    "bonusType": "Developer",
    "value": "10",
    "isPercent": "true"
}
     *
     * @apiSuccess {Object} NewBonusType Just created bonus type
     * @apiSuccessExample Success-Response:
HTTP/1.1 201 Created
{
    "success": {
        "__v": 0,
        "name": "Sales/Head 10%",
        "value": 10,
        "isPercent": true,
        "_id": "577f50d873ac376519277cb2",
        "bonusType": "Developer"
    }
}
     */
    router.post('/', accessStackMiddleware, handler.create);

    /**
     *@api {patch} /bonusType/ Request for partly updating Bonus Type
     *
     * @apiVersion 0.0.1
     * @apiName updateBonusType
     * @apiGroup BonusType
     *
     * @apiParamExample {json} Request-Example:
[
    {
        "name": "Sales/Head 9%",
        "_id": "55b92ad521e4b7c40f000602"
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
    router.patch('/', accessStackMiddleware, handler.patchM);
    router.delete('/:_id',accessStackMiddleware,  handler.remove);

    /**
     *@api {delete} /bonusType/ Request for deleting selected Bonus Types
     *
     * @apiVersion 0.0.1
     * @apiName deleteSelectedBonusTypes
     * @apiGroup BonusType
     *
     * @apiParamExample {json} Request-Example:
{
    "contentType": "bonusType",
    "ids": [
         "55b92ad521e4b7c40f000604",
         "55b92ad521e4b7c40f000605"
    ]
}
     *
     * @apiSuccess {Object} Status Stutus and number of deleted bonus types
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
     "ok":1,
     "n":2
}
     */
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
