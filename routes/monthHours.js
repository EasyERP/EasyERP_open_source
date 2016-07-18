var MonthHoursHandler = require('../handlers/monthHours');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    var handler = new MonthHoursHandler(event, models);
    var moduleId = MODULES.MONTHHOURS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /monthHours/ Request MonthHours
     *
     * @apiVersion 0.0.1
     * @apiName getMonthHours
     * @apiGroup Month Hours
     *
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of MonthHours which will show
     * @apiParam (?Field=value) {String} contentType="monthHours" Type of content
     *
     * @apiSuccess {Object} MonthHours
     * @apiSuccessExample Success-Response:
HTTP/1.1 304 Not Modified
{
    "total": 24,
    "data": [
        {
            "_id": "55b92ace21e4b7c40f000005",
            "fixedExpense": 40,
            "expenseCoefficient": 1.2,
            "year": 2014,
            "hours": 160,
            "month": 8,
            "ID": 1,
            "__v": 0,
            "dateByMonth": 201408,
            "overheadRate": 6.593548686818632,
            "actualHours": 4036,
            "estimatedHours": 8568,
            "adminSalaryBudget": 2400,
            "adminBudget": 6000,
            "vacationBudget": 3397.5,
            "idleBudget": 14814.06
        },
        {
            "_id": "55b92ace21e4b7c40f000006",
            "fixedExpense": 40,
            "expenseCoefficient": 1.2,
            "year": 2014,
            "hours": 176,
            "month": 9,
            "ID": 2,
            "__v": 0,
            "dateByMonth": 201409,
            "overheadRate": 8.150519354069012,
            "actualHours": 3937,
            "estimatedHours": 0,
            "adminSalaryBudget": 2313.33,
            "adminBudget": 10321,
            "vacationBudget": 327.27,
            "idleBudget": 19126.99
        },
        ...
    ]
}
     * */
    router.get('/', function (req, res, next) {
        if (req.query.month) {
            handler.getData(req, res, next);
        } else {
            handler.getList(req, res);
        }
    });

    /**
     *@api {post} /monthHours/ Request for creating new MonthHour
     *
     * @apiVersion 0.0.1
     * @apiName createMonthHour
     * @apiGroup Month Hours
     *
     *
     * @apiParamExample {json} Request-Example:
{
    "year": "2015",
    "hours": "122",
    "month": "2"
}
     *
     * @apiSuccess {Object} newMonthHour
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "__v": 0,
    "year": 2015,
    "hours": 122,
    "month": 2,
    "_id": "57888e81499f9ee114db5994",
    "dateByMonth": 201502,
    "overheadRate": 0,
    "actualHours": 0,
    "estimatedHours": 0,
    "adminSalaryBudget": 0,
    "adminBudget": 0,
    "vacationBudget": 0,
    "idleBudget": 0
}
     * */
    router.post('/', handler.create);

    /**
     *@api {patch} /monthHours/ Request for partly updating MonthHour
     *
     * @apiVersion 0.0.1
     * @apiName updateMonthHour
     * @apiGroup Month Hours
     *
     * @apiParamExample {json} Request-Example:
[
    {
        "adminBudget": 6000,
        "vacationBudget": 0,
        "idleBudget": 0,
        "adminSalaryBudget": 2400,
        "actualHours": 4036,
        "overheadRate": 2.0812685827552033,
        "expenseCoefficient": "1.2",
        "hours": "170",
        "_id": "55b92ace21e4b7c40f000005"
    }
]
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"updated"
}
     *
     * */
    router.patch('/', handler.patchM);

    router.delete('/:id', handler.remove);

    /**
     *@api {delete} /monthHours/ Request for deleting selected MonthHours
     *
     * @apiVersion 0.0.1
     * @apiName deleteMonthHours
     * @apiGroup Month Hours
     *
     * @apiParamExample {json} Request-Example:
{
    "contentType": "monthHours",
    "ids": [
        "55b92ace21e4b7c40f000006",
        "55b92ace21e4b7c40f000007"
    ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":true
}
     * */
    router.delete('/', handler.bulkRemove);

    return router;
};
