var express = require('express');
var router = express.Router();
var jobPositionHandler = require('../handlers/jobPosition');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';
    var handler = new jobPositionHandler(models);
    var moduleId = MODULES.JOBPOSITIONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'jobPosition', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /JobPositions/ Request JobPositions
     *
     * @apiVersion 0.0.1
     * @apiName getJobPositions
     * @apiGroup Job Positions
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of JobPositions which will show
     * @apiParam (?Field=value) {String} contentType="JobPositions" Type of content
     *
     * @apiSuccess {Object} JobPositions
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "total": 69,
      "data": [
        {
          "_id": "55b92acf21e4b7c40f000017",
          "department": {
            "_id": "55b92ace21e4b7c40f000016",
            "name": "Web"
          },
          "ID": 1,
          "editedBy": {
            "date": "2015-07-29T19:34:39.102Z",
            "user": {
              "_id": "52203e707d4dba8813000003",
              "__v": 0,
              "attachments": [
    
              ],
              "credentials": {
                "access_token": "",
                "refresh_token": ""
              },
              "email": "info@thinkmobiles.com",
              "kanbanSettings": {
                "applications": {
                  "countPerPage": 10,
                  "foldWorkflows": [
                    "Empty"
                  ]
                },
                "opportunities": {
                  "countPerPage": 143,
                  "foldWorkflows": [
                    "Empty"
                  ]
                },
                "tasks": {
                  "countPerPage": 10,
                  "foldWorkflows": [
                    "528ce3caf3f67bc40b000013",
                    "528ce3acf3f67bc40b000012",
                    "528ce30cf3f67bc40b00000f",
                    "528ce35af3f67bc40b000010"
                  ]
                }
              },
              "lastAccess": "2016-07-11T16:00:06.954Z",
              "login": "admin",
              "pass": "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
              "profile": 1387275598000,
              "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
              "savedFilters": [
                {
                  "_id": "574335bb27725f815747d579",
                  "viewType": "",
                  "byDefault": "Leads"
                }
              ],
              "relatedEmployee": "55b92ad221e4b7c40f00004f"
            }
          },
          "createdBy": {
            "date": "2015-07-29T19:34:39.102Z",
            "user": {
              "_id": "52203e707d4dba8813000003",
              "__v": 0,
              "attachments": [
    
              ],
              "credentials": {
                "access_token": "",
                "refresh_token": ""
              },
              "email": "info@thinkmobiles.com",
              "kanbanSettings": {
                "applications": {
                  "countPerPage": 10,
                  "foldWorkflows": [
                    "Empty"
                  ]
                },
                "opportunities": {
                  "countPerPage": 143,
                  "foldWorkflows": [
                    "Empty"
                  ]
                },
                "tasks": {
                  "countPerPage": 10,
                  "foldWorkflows": [
                    "528ce3caf3f67bc40b000013",
                    "528ce3acf3f67bc40b000012",
                    "528ce30cf3f67bc40b00000f",
                    "528ce35af3f67bc40b000010"
                  ]
                }
              },
              "lastAccess": "2016-07-11T16:00:06.954Z",
              "login": "admin",
              "pass": "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
              "profile": 1387275598000,
              "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
              "savedFilters": [
                {
                  "_id": "574335bb27725f815747d579",
                  "viewType": "",
                  "byDefault": "Leads"
                }
              ],
              "relatedEmployee": "55b92ad221e4b7c40f00004f"
            }
          },
          "totalForecastedEmployees": 36,
          "numberOfEmployees": 31,
          "groups": {
            "group": [
    
            ],
            "users": [
    
            ],
            "owner": null
          },
          "whoCanRW": "everyOne",
          "workflow": {
            "_id": "528ce71ef3f67bc40b00001d",
            "name": "Recruitement in Progress",
            "status": "In Progress"
          },
          "expectedRecruitment": 5,
          "name": "Junior JS",
          "__v": 0
        },
        ...
        ]
}
     * */
    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.get('/getFilterValues', accessStackMiddleware, handler.getFilterValues);

    /**
     *@api {get} /jobPositions/jobType/ Request Job Types
     *
     * @apiVersion 0.0.1
     * @apiName getJobTypes
     * @apiGroup Job Positions
     *
     * @apiSuccess {Object} JobTypes
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [
        {
          "_id": "55eeeddd6dceaee10b00001f",
          "name": "2D Artist"
        },
        {
          "_id": "55b92acf21e4b7c40f00002e",
          "name": "Account Manager"
        },
        {
          "_id": "5603a84fa5ac49794e00001a",
          "name": "Accountant"
        },
        ...
        ]
}
     * */
    router.get('/getForDd', handler.getForDd);

    /**
     *@api {get} /jobPositions/jobType/ Request Job Types
     *
     * @apiVersion 0.0.1
     * @apiName getJobTypes
     * @apiGroup Job Positions
     *
     * @apiSuccess {Object} JobTypes
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [
        {
          "_id": "contract",
          "name": "Contract"
        },
        {
          "_id": "fullTime",
          "name": "Full-time"
        },
        {
          "_id": "internship",
          "name": "Internship"
        },
        {
          "_id": "partTime",
          "name": "Part-time"
        },
        {
          "_id": "remote",
          "name": "Remote"
        },
        {
          "_id": "temporary",
          "name": "Temporary"
        }
      ]
}
     * */
    router.get('/jobType', handler.jobType);

    /**
     *@api {post} /jobPositions/ Request for creating new Job Position
     *
     * @apiVersion 0.0.1
     * @apiName createNewJobPosition
     * @apiGroup Job Positions
     *
     * @apiParamExample {json} Request-Example:
{
      "name": "Junior SEO",
      "expectedRecruitment": 1,
      "interviewForm": {
        "id": "",
        "name": ""
      },
      "department": "55b92ace21e4b7c40f000016",
      "description": "",
      "requirements": "",
      "workflow": "528ce71ef3f67bc40b00001d",
      "groups": {
        "owner": null,
        "users": [
    
        ],
        "group": [
    
        ]
      },
      "whoCanRW": "everyOne"
}
     *
     * @apiSuccess {Object} Status Status of successfully created new Job Position
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "A new JobPosition create success",
      "id": "5784ab81d712cbd31f6e895b"
}
     * */
    router.post('/', accessStackMiddleware, handler.create);

    /**
     *@api {patch} /jobPositions/:id Request for updating Job Position
     *
     * @apiVersion 0.0.1
     * @apiName updateJobPosition
     * @apiGroup Job Positions
     *
     * @apiParam {String} id Unique id of Job Position
     *
     * @apiParamExample {json} Request-Example:
{
      "name": "Junior JS",
      "expectedRecruitment": 6,
      "description": "",
      "requirements": "",
      "department": "55b92ace21e4b7c40f000016",
      "groups": {
        "owner": null,
        "users": [

        ],
        "group": [

        ]
      },
      "whoCanRW": "everyOne"
}
     *
     * @apiSuccess {Object} Status Status of successfully updated Job Position
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"JobPosition updated success"
}
     *
     * */
    router.patch('/:id', accessStackMiddleware, handler.update);
    router.put('/:id', accessStackMiddleware, handler.update);

    router.delete('/:id', accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /jobPositions/ Request for deleting Job Positions
     *
     * @apiVersion 0.0.1
     * @apiName deletingJobPositions
     * @apiGroup Job Positions
     *
     * @apiParamExample {json} Request-Example:
     * {
          "contentType": "JobPositions",
          "ids": [
                "55b92acf21e4b7c40f000018",
                "55b92acf21e4b7c40f000019"
          ]
        }
     *
     * @apiSuccess {Object} Status Status of successfully deleted Job Positions
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "ok":1,
    "n":2
}
     *
     * */
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
