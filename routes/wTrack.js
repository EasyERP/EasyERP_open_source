var express = require('express');
var router = express.Router();
var WTrackHandler = require('../handlers/wTrack');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new WTrackHandler(event, models);
    var moduleId = MODULES.WTRACK;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'wTrack', event);
    }

    router.use(authStackMiddleware); // added generall check on auth

    router.get('/getForProjects', accessStackMiddleware, handler.getForProjects);
    // router.get('/exportToXlsx',handler.exportToXlsx);
    // router.get('/exportToCsv',handler.exportToCsv);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/dash', handler.getForDashVacation);
    router.get('/hours', handler.getHours);

    /**
     *@api {get} /wTrack/ Request wTracks
     *
     * @apiVersion 0.0.1
     * @apiName getWTracks
     * @apiGroup wTrack
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of wTracks which will show
     * @apiParam (?Field=value) {String} contentType="wTrack" Type of content
     *
     * @apiSuccess {String} WTracks
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "total": 10865,
           "data": [
             {
               "1": 8,
               "2": 8,
               "3": 8,
               "4": 0,
               "5": 0,
               "6": 0,
               "7": 0,
               "_id": "5787a78be310cbc64dc9d2f8",
               "total": 10865,
               "customer": {
                 "name": {
                   "last": "",
                   "first": "Digipresence"
                 }
               },
               "project": {
                 "_id": "573db3d09fdef3d14282b561",
                 "name": "ADBC"
               },
               "employee": {
                 "_id": "577b6349d2658cb5213589b2",
                 "name": {
                   "last": "Khutorskyi",
                   "first": "Alex"
                 }
               },
               "department": {
                 "_id": "55b92ace21e4b7c40f000016",
                 "name": "Web"
               },
               "jobs": {
                 "_id": "5787a78be310cbc64dc9d2f5",
                 "name": "Designer"
               },
               "workflow": {
                 "_id": "528ce7d0f3f67bc40b000021",
                 "name": "New"
               },
               "dateByWeek": 201629,
               "month": 7,
               "year": 2016,
               "week": 29,
               "worked": 24,
               "_type": "ordinary",
               "createdBy": {
                 "date": "2016-07-14T14:54:03.599Z"
               },
               "notRemovable": false
             },
             ...
           ]
     }
     */
    router.get('/', accessStackMiddleware, handler.getByViewType);

    router.get('/exportToXlsx', handler.exportToXlsx);
    router.get('/exportToCsv', handler.exportToCsv);

    /**
     *@api {post} /wTrack/ Request for creating new wTrack
     *
     * @apiVersion 0.0.1
     * @apiName crateWTrack
     * @apiGroup wTrack
     *
     * @apiParamExample {json} Request-Example:
     {
           "1": "8",
           "2": "8",
           "3": "8",
           "4": "8",
           "5": "8",
           "6": 0,
           "7": 0,
           "year": 2016,
           "month": 7,
           "week": 29,
           "projectModel": null,
           "_type": "overtime",
           "dateByWeek": 0,
           "dateByMonth": 0,
           "project": "573db3d09fdef3d14282b561",
           "customer": {

           },
           "workflow": {

           },
           "employee": "565f0fa6f6427f253cf6bf19",
           "department": "55b92ace21e4b7c40f000016",
           "worked": 40,
           "revenue": 0,
           "cost": 0,
           "amount": 0,
           "rate": 0,
           "jobs": "5787a78be310cbc64dc9d2f5"
     }
     *
     * @apiSuccess {String} NewWTrack
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "1": 8,
       "2": 8,
       "3": 8,
       "4": 8,
       "5": 8,
       "6": 0,
       "7": 0,
       "__v": 0,
       "year": 2016,
       "month": 7,
       "week": 29,
       "dateByWeek": 0,
       "dateByMonth": 0,
       "worked": 40,
       "rate": 0,
       "_id": "578c961a1fc1da6b1ff5d364",
       "jobs": "5787a78be310cbc64dc9d2f5",
       "createdBy": {
         "date": "2016-07-18T08:40:58.103Z",
         "user": null
       },
       "editedBy": {
         "date": "2016-07-18T08:40:58.102Z",
         "user": null
       },
       "groups": {
         "group": [

         ],
         "users": [

         ],
         "owner": null
       },
       "whoCanRW": "everyOne",
       "info": {
         "salePrice": 100,
         "productType": "wTrack"
       },
       "invoice": null,
       "isPaid": false,
       "amount": 0,
       "cost": 0,
       "oldRevenue": 0,
       "revenue": 0,
       "_type": "overtime",
       "department": "55b92ace21e4b7c40f000016",
       "employee": "565f0fa6f6427f253cf6bf19",
       "project": "573db3d09fdef3d14282b561",
       "id": "578c961a1fc1da6b1ff5d364"
     }
     ]
     */
    router.post('/', accessStackMiddleware, handler.create);

    /**
     *@api {post} /wTrack/generateWTrack/ Request for generating wTrack
     *
     * @apiVersion 0.0.1
     * @apiName GenerateWTrack
     * @apiGroup wTrack
     *
     * @apiParamExample {json} Request-Example:
     [
     {
       "1": 8,
       "2": 8,
       "3": 8,
       "4": 8,
       "5": 8,
       "6": 0,
       "7": 0,
       "startDate": "6 Jul, 2016",
       "endDate": "20 Jul, 2016",
       "hours": "",
       "project": "573db3d09fdef3d14282b561",
       "employee": "577b6349d2658cb5213589b2",
       "department": "55b92ace21e4b7c40f000016"
     }
     ]
     *
     * @apiSuccess {String} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     "success"
     */
    router.post('/generateWTrack', accessStackMiddleware, handler.generateWTrack);

    /**
     *@api {patch} /wTrack/ Request for partly updating wTracks
     *
     * @apiVersion 0.0.1
     * @apiName updateWTracks
     * @apiGroup wTrack
     *
     * @apiParamExample {json} Request-Example:
     [
     {
       "project": "5747f6df5c66305667bff462",
       "jobs": "5747f789e4dc1735677bc77f",
       "_id": "5787a78be310cbc64dc9d2f7"
     },
     {
       "project": "56e689c75ec71b00429745a9",
       "jobs": "56e6f1ae0d773c634e918b68",
       "_id": "5787a78be310cbc64dc9d2f8"
     },
     {
       "jobs": "5769054e0a750b1a211c03a3",
       "_id": "578c961a1fc1da6b1ff5d364"
     }
     ]
     *
     * @apiSuccess {String} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": "updated"
     }
     */
    router.patch('/', accessStackMiddleware, handler.putchBulk);
    router.patch('/:id', accessStackMiddleware, handler.putchModel);
    /* router.put('/:id', handler.updateModel);*/

    router.delete('/:id', accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /wTrack/ Request for deleting selected wTracks
     *
     * @apiVersion 0.0.1
     * @apiName deleteWTracks
     * @apiGroup wTrack
     *
     * @apiParamExample {json} Request-Example:
     {
     "contentType": "wTrack",
     "ids": [
         "578c961a1fc1da6b1ff5d364",
         "5787a78be310cbc64dc9d2f8"
     ]
     }
     *
     * @apiSuccess {String} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":true
     }
     */
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
