var express = require('express');
var router = express.Router();
var ScheduledPayHandler = require('../handlers/scheduledPay');

module.exports = function (models) {
    var handler = new ScheduledPayHandler(models);

    /**
     *@api {get} /scheduledPay/ Request ScheduledPay
     *
     * @apiVersion 0.0.1
     * @apiName getScheduledPay
     * @apiGroup Scheduled Pay
     *
     * @apiParam (?Field=value) {Number} count=100 Count of ScheduledPay which will show
     *
     * @apiSuccess {Object} ScheduledPay
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": "5784d6cf2b247ee4133d7399",
         "__v": 0,
         "name": "monthly"
     }
]
     */
    router.get('/', handler.getForView);
    router.get('/forDd', handler.getForDd);

    /**
     *@api {post} /scheduledPay/ Request for creating new ScheduledPay
     *
     * @apiVersion 0.0.1
     * @apiName newScheduledPay
     * @apiGroup Scheduled Pay
     *
     * @apiParamExample {json} Request-Example:
{
    "name": "NewSchedulePayName"
}
     *
     * @apiSuccess {Object} newScheduledPay
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "__v": 0,
    "_id": "5788b2d3c88875ac75cee488",
    "name": "NewSchedulePayName"
}
     */
    router.post('/', handler.create);

    /**
     *@api {patch} /scheduledPay/:id Request for partly updating ScheduledPay
     *
     * @apiVersion 0.0.1
     * @apiName updateScheduledPay
     * @apiGroup Scheduled Pay
     *
     * @apiParam {String} id Unique id of ScheduledPay
     * @apiParamExample {json} Request-Example:
{
    "name": "SchedulePayName"
}
     *
     * @apiSuccess {Object} updatedScheduledPay
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "_id": "5788b2d3c88875ac75cee488",
    "__v": 0,
    "name": "NewSchedulePayName"
}
     */
    router.patch('/:id', handler.update);

    /**
     *@api {delete} /scheduledPay/:id Request for deleting ScheduledPay
     *
     * @apiVersion 0.0.1
     * @apiName deleteScheduledPay
     * @apiGroup Scheduled Pay
     *
     * @apiParam {String} id Unique id of ScheduledPay
     *
     * @apiSuccess {Object} deletedScheduledPay
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "_id": "5788b2d3c88875ac75cee488",
    "__v": 0,
    "name": "SchedulePayName"
}
     */
    router.delete('/:id', handler.delete);

    return router;
};
