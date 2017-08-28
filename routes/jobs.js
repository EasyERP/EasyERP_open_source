var express = require('express');
var router = express.Router();
var jobsHandler = require('../handlers/jobs');

module.exports = function (models, event) {
    var handler = new jobsHandler(models, event);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'jobs', event);
    }

    router.get('/', handler.getData);
    router.get('/getForOverview', handler.getForOverview);
    router.get('/getForProjectsDashboard', handler.getForProjectsDashboard);
    router.get('/getAsyncData', handler.getAsyncData);


    /**
     *@api {get} /jobs/getForDD/ Request Jobs for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getJobsForDD
     * @apiGroup Jobs
     *
     * @apiParam (?Field=value) {String} projectId Unique id of project
     * @apiParam (?Field=value) {Boolean} all=true
     *
     * @apiSuccess {Object} JobsForDD
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     [
     {
       "_id": "56e6f1ae0d773c634e918b68",
       "budget": {
         "budgetTotal": {
           "costSum": 0,
           "revenueSum": 0,
           "hoursSum": 76,
           "maxDate": 201612,
           "minDate": 201611
         },
         "budget": [

         ],
         "projectValues": [

         ],
         "projectTeam": [
           {
             "department": {
               "_id": "55b92ace21e4b7c40f00000f",
               "departmentName": "iOS"
             },
             "employee": {
               "_id": "55b92ad221e4b7c40f000085",
               "jobPosition": {
                 "_id": "55b92acf21e4b7c40f00001d",
                 "name": "Middle iOS"
               },
               "name": {
                 "last": "Gorbushko",
                 "first": "Kirill"
               }
             },
             "budget": {
               "costSum": 0,
               "revenueSum": 0,
               "hoursSum": 12
             }
           },
           {
             "department": {
               "_id": "55b92ace21e4b7c40f00000f",
               "departmentName": "iOS"
             },
             "employee": {
               "_id": "55b92ad221e4b7c40f00007d",
               "jobPosition": {
                 "_id": "55b92acf21e4b7c40f00001d",
                 "name": "Middle iOS"
               },
               "name": {
                 "last": "Volskiy",
                 "first": "Stas"
               }
             },
             "budget": {
               "costSum": 0,
               "revenueSum": 0,
               "hoursSum": 64
             }
           }
         ]
       },
       "name": "March"
     }
     ]
     *
     * */
    router.get('/getForDD', handler.getForDD);

    router.get('/exportToXlsx', handler.exportToXlsx);
    router.get('/exportToCsv', handler.exportToCsv);

    /**
     *@api {post} /jobs/ Request for creating new Job
     *
     * @apiVersion 0.0.1
     * @apiName createNewJob
     * @apiGroup Jobs
     *
     * @apiParamExample {json} Request-Example:
     {
         "project": "56e689c75ec71b00429745a9",
         "name": "New Sprint"
     }
     *
     * @apiSuccess {Object} JobsForDD
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "success": {
             "__v": 0,
             "_id": "5784b7c3fa7fb9d626a694d0",
             "reconcile": true,
             "createdBy": {
               "date": "2016-07-12T09:26:27.480Z",
               "user": "52203e707d4dba8813000003"
             },
             "editedBy": {
               "date": "2016-07-12T09:26:27.481Z",
               "user": null
             },
             "invoice": null,
             "quotation": null,
             "budget": {
               "budget": [

               ],
               "projectValues": [

               ],
               "projectTeam": [

               ]
             },
             "project": "566d4bc3abccac87642cb523",
             "wTracks": [

             ],
             "type": "Not Ordered",
             "workflow": "56337c705d49d8d6537832eb",
             "name": "New Sprint"
           }
     }
     **/
    router.post('/', handler.create);
    router.post('/update', handler.update);

    router.delete('/:_id', accessDeleteStackMiddlewareFunction, handler.remove);

    return router;
};
