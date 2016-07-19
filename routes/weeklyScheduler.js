var express = require('express');
var router = express.Router();
var WeeklySchedulerHandler = require('../handlers/weeklyScheduler');

module.exports = function (models) {
    var handler = new WeeklySchedulerHandler(models);

    /**
     *@api {get} /weeklyScheduler/forDd/ Request WeeklySchedulerForDd
     *
     * @apiVersion 0.0.1
     * @apiName getWeeklySchedulerForDd
     * @apiGroup Weekly Scheduler
     *
     * @apiSuccess {Object} WeeklySchedulerForDd
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": "57332c3b94ee1140b6bb49e2",
            "name": "UA-40"
        }
    ]
}
     */
    router.get('/forDd', handler.getForDd);
    router.get('/:viewType', function (req, res, next) {
        var viewType = req.params.viewType;
        switch (viewType) {
            case 'form':
                handler.getInvoiceById(req, res, next);
                break;
            default:
                handler.getForView(req, res, next);
        }
    });

    /**
     *@api {post} /weeklyScheduler/ Request for creating new WeeklyScheduler
     *
     * @apiVersion 0.0.1
     * @apiName createWeeklyScheduler
     * @apiGroup Weekly Scheduler
     *
     * @apiParamExample {json} Request-Example:
{
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "name": "UA-55",
      "totalHours": "0"
}
     *
     * @apiSuccess {Object} newWeeklyScheduler
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "__v": 0,
      "_id": "5788aebfc88875ac75cee487",
      "totalHours": 0,
      "name": "UA-55"
}
     */
    router.post('/', handler.create);

    /**
     *@api {patch} /weeklyScheduler/:id Request for partly updating WeeklyScheduler
     *
     * @apiVersion 0.0.1
     * @apiName updateWeeklyScheduler
     * @apiGroup Weekly Scheduler
     *
     * @apiParamExample {json} Request-Example:
{
      "1": 8,
      "2": 8,
      "3": 8,
      "4": 10,
      "5": 8,
      "6": 0,
      "7": 0,
      "name": "UA-40",
      "totalHours": "42"
}
     *
     * @apiSuccess {Object} newWeeklyScheduler
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "1": 8,
      "2": 8,
      "3": 8,
      "4": 8,
      "5": 8,
      "6": 0,
      "7": 0,
      "_id": "57332c3b94ee1140b6bb49e2",
      "totalHours": 40,
      "name": "UA-40"
}
     */
    router.patch('/:id', handler.update);

    /**
     *@api {delete} /weeklyScheduler/:id Request for deleting WeeklyScheduler
     *
     * @apiVersion 0.0.1
     * @apiName deleteWeeklyScheduler
     * @apiGroup Weekly Scheduler
     *
     * @apiParam {String} id Unique id of WeeklyScheduler
     *
     * @apiSuccess {Object} deletedWeeklyScheduler
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "_id": "5788aebfc88875ac75cee487",
      "__v": 0,
      "totalHours": 0,
      "name": "UA-55"
}
     */
    router.delete('/:id', handler.delete);

    return router;
};
