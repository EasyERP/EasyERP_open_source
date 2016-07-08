var BonusTypeHandler = require('../handlers/bonusType');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new BonusTypeHandler(models);
    var moduleId = MODULES.BONUSTYPE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /bonusType/ Request Bonus Types
     *
     * @apiVersion 0.0.1
     * @apiName getbonusTypes
     * @apiGroup BonusType
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of bonusTypes which will show
     * @apiParam (?Field=value) {String} contentType="bonusType" Type of content
     *
     * @apiSuccess {Object} BonusTypes Bunus Types
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
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
        {
            "_id": "55b92ad521e4b7c40f000604",
            "isPercent": true,
            "value": 2,
            "name": "Sales/Ref 2%",
            "ID": 4,
            "__v": 0,
            "bonusType": "Sales"
        },
        {
            "_id": "55b92ad521e4b7c40f000605",
            "isPercent": true,
            "value": 16,
            "name": "Sales/QA 16%",
            "ID": 5,
            "__v": 0,
            "bonusType": "Sales"
        },
        {
            "_id": "55b92ad521e4b7c40f000606",
            "isPercent": true,
            "value": 14,
            "name": "Sales/QA 14%",
            "ID": 6,
            "__v": 0,
            "bonusType": "Sales"
        },
        {
            "_id": "55b92ad521e4b7c40f000607",
            "isPercent": true,
            "value": 8,
            "name": "Sales/QA 8%",
            "ID": 7,
            "__v": 0,
            "bonusType": "Sales"
        },
        {
            "_id": "55b92ad521e4b7c40f000608",
            "isPercent": true,
            "value": 8,
            "name": "Sales/Usual 8%",
            "ID": 8,
            "__v": 0,
            "bonusType": "Sales"
        },
        {
            "_id": "55b92ad521e4b7c40f000609",
            "isPercent": true,
            "value": 10,
            "name": "Sales/Head 10%",
            "ID": 9,
            "__v": 0,
            "bonusType": "Sales"
        },
        {
            "_id": "55b92ad521e4b7c40f00060a",
            "isPercent": true,
            "value": 1.5,
            "name": "PM Junior/Usual 1.5%",
            "ID": 10,
            "__v": 0,
            "bonusType": "PM"
        },
        {
            "_id": "55b92ad521e4b7c40f00060b",
            "isPercent": false,
            "value": 30,
            "name": "PM Base/Junior",
            "ID": 12,
            "__v": 0,
            "bonusType": "PM"
        },
        {
            "_id": "560eaaa5c90e2fb026ce061e",
            "name": "Sales/Usual 4%",
            "value": 4,
            "isPercent": true,
            "__v": 0,
            "bonusType": "Sales"
        }
    ]
}
     "workflowId": "528ce61bf3f67bc40b000019",
     "time": 191,
     "fold": false
     }
     */
    router.get('/', handler.getList);
    router.get('/getForDD', handler.getForDD);

    /**
     *@api {post} /bonusType/ Request for creating Bonus Type
     *
     * @apiVersion 0.0.1
     * @apiName createNewBonusType
     * @apiGroup BonusType
     *
     * @apiParamExample {json} Request-Example:
     * {
  "name": "Sales/Head 10%",
  "bonusType": "Developer",
  "value": "10",
  "isPercent": "true"
}
     *
     * @apiSuccess {Object} NewBonusType Just created bonus type
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *{
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
    router.post('/', handler.create);

    /**
     *@api {patch} /bonusType/ Request for partly updating Bonus Type
     *
     * @apiVersion 0.0.1
     * @apiName updateBonusType
     * @apiGroup BonusType
     *
     * @apiParamExample {json} Request-Example:
     * [
     {
       "name": "Sales/Head 9%",
       "_id": "55b92ad521e4b7c40f000602"
     }
     ]
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     {"success":"updated"}
     */
    router.patch('/', handler.patchM);

    /**
     *@api {delete} /bonusType/ Request for deleting one Bonus Type
     *
     * @apiVersion 0.0.1
     * @apiName deleteOneBonusType
     * @apiGroup BonusType
     *
     * @apiParamExample {json} Request-Example:
     {
  "contentType": "bonusType",
  "ids": [
    "55b92ad521e4b7c40f000602"
  ]
}
     *
     * @apiSuccess {Object} Status Stutus and number of deleted bonus types
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":1
     }
     */
    router.delete('/:_id', handler.remove);

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
     *     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":2
     }
     */
    router.delete('/', handler.bulkRemove);

    return router;
};
