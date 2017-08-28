var express = require('express');
var router = express.Router();
var TasksHandler = require('../handlers/tasks');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';
    var moduleId = MODULES.TASKS;
    var handler = new TasksHandler(models, event);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'tasks', event);
    }

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /tasks/priority/ Request Tasks Priority
     *
     * @apiVersion 0.0.1
     * @apiName getPriority
     * @apiGroup Tasks
     *
     * @apiSuccess {Object} Priority
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": "P1",
            "attachments": [],
            "priority": "P1",
            "type": "Tasks"
        },
        {
            "_id": "P2",
            "attachments": [],
            "priority": "P2",
            "type": "Tasks"
        },
        ...
    ]
}
     */
    router.get('/priority', handler.getTasksPriority);
    router.get('/getLengthByWorkflows', handler.getLengthByWorkflows);

    /**
     *@api {get} /tasks/getFilterValues/ Request FilterValues
     *
     * @apiVersion 0.0.1
     * @apiName getFilterValues
     * @apiGroup Tasks
     *
     * @apiSuccess {Object} FilterValues
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": null,
         "type": [
             "Feature",
             "Bug",
             "Task"
         ]
     }
]
     */
    router.get('/getFilterValues', handler.getFilterValues);

    /**
     *@api {get} /tasks/ Request Tasks
     *
     * @apiVersion 0.0.1
     * @apiName getTasks
     * @apiGroup Tasks
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Tasks which will show
     * @apiParam (?Field=value) {String} contentType="Tasks" Type of content
     *
     * @apiSuccess {Object} Tasks
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "total": 1,
      "data": [
        {
          "_id": "5717661c2c8b789c7a0bb82d",
          "total": 1,
          "summary": "Testing",
          "type": "Task",
          "workflow": {
            "_id": "528ce35af3f67bc40b000010",
            "__v": 0,
            "attachments": [

            ],
            "color": "#2C3E50",
            "name": "Testing",
            "sequence": 2,
            "status": "In Progress",
            "wId": "Tasks",
            "wName": "task",
            "source": "task",
            "targetSource": [
              "task"
            ],
            "visible": true
          },
          "assignedTo": {
            "_id": "55b92ad221e4b7c40f000090",
            "dateBirth": "1992-12-20T04:00:00.000Z",
            "ID": 1105,
            "isLead": 0,
            "fire": [

            ],
            "hire": [
              "2015-01-21T22:00:00.000Z"
            ],
            "social": {
              "FB": "",
              "LI": ""
            },
            "sequence": 0,
            "jobType": "Full-time",
            "gender": "male",
            "marital": "unmarried",
            "contractEnd": {
              "date": "2015-07-29T19:34:42.492Z",
              "reason": ""
            },
            "attachments": [

            ],
            "editedBy": {
              "date": "2016-05-27T06:35:42.431Z",
              "user": "55b8cb7d0ce4affc2a0015cb"
            },
            "createdBy": {
              "date": "2015-07-29T19:34:42.492Z",
              "user": "52203e707d4dba8813000003"
            },
            "creationDate": "2015-07-29T19:34:42.492Z",
            "color": "#4d5a75",
            "otherInfo": "",
            "groups": {
              "group": [

              ],
              "users": [

              ],
              "owner": "55ba28c8d79a3a3439000016"
            },
            "whoCanRW": "everyOne",
            "workflow": null,
            "active": false,
            "referredBy": "",
            "source": "",
            "age": 23,
            "homeAddress": {
              "country": "",
              "zip": "",
              "state": "",
              "city": "",
              "street": ""
            },
            "otherId": "",
            "bankAccountNo": "",
            "nationality": "",
            "coach": null,
            "manager": "55b92ad221e4b7c40f000030",
            "jobPosition": "561b73fb9ebb48212ea838bf",
            "department": "55bb1f40cb76ca630b000007",
            "visibility": "Public",
            "relatedUser": null,
            "officeLocation": "",
            "skype": "sterr.gabriella",
            "workPhones": {
              "phone": "",
              "mobile": "+380662662064"
            },
            "personalEmail": "sterr.gabriella@gmail.com",
            "workEmail": "gabriella.shterr@thinkmobiles.com",
            "workAddress": {
              "country": "",
              "zip": "",
              "state": "",
              "city": "",
              "street": ""
            },
            "tags": [
              ""
            ],
            "name": {
              "last": "Shterr",
              "first": "Gabriella"
            },
            "subject": "",
            "imageSrc": "data:image/jpeg;base64,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",
            "isEmployee": true,
            "__v": 0,
            "transferred": [
              {
                "department": {
                  "name": "Marketing",
                  "_id": "55b92ace21e4b7c40f000013"
                },
                "date": "2015-09-28T12:17:45.141Z"
              }
            ],
            "weeklyScheduler": "57332c3b94ee1140b6bb49e2"
          },
          "project": {
            "_id": "56e689c75ec71b00429745a9",
            "TargetEndDate": "2016-03-31T00:00:00.000Z",
            "StartDate": null,
            "budget": {
              "projectTeam": [
                "56e6f1ae0d773c634e918b68"
              ],
              "bonus": [

              ]
            },
            "bonus": [

            ],
            "health": 1,
            "editedBy": {
              "date": "2016-03-14T16:19:02.059Z",
              "user": "55b9fc0fd79a3a3439000008"
            },
            "attachments": [

            ],
            "notes": [

            ],
            "projecttype": "iOs",
            "createdBy": {
              "date": "2016-03-14T09:52:07.280Z",
              "user": "55b9fc0fd79a3a3439000008"
            },
            "progress": 0,
            "remaining": 0,
            "logged": 0,
            "estimated": 0,
            "workflow": "528ce7f2f3f67bc40b000023",
            "parent": null,
            "sequence": 0,
            "groups": {
              "owner": "560c099da5d4a2e20ba5068b",
              "users": [

              ],
              "group": [

              ]
            },
            "whoCanRW": "everyOne",
            "customer": "56a9eeabd59a04d6225b0df5",
            "task": [
              "5717661c2c8b789c7a0bb82d"
            ],
            "projectShortDesc": "SDK",
            "__v": 0,
            "EndDate": null,
            "paymentTerms": "55536e52475b7be475f335f6",
            "paymentMethod": "565f2e05ab70d49024242e07",
            "name": "360CamSDK"
          },
          "editedBy": {
            "user": {
              "_id": "563f673270bbc2b740ce89ae",
              "profile": 1387275598000,
              "savedFilters": [
                {
                  "_id": "573dc01eaf2e939f7706d93e",
                  "contentType": null,
                  "byDefault": false
                },
                 ...,
                {
                  "_id": "577bd1c250b8cfbf7299fe1e",
                  "contentType": "salesProforma",
                  "byDefault": true
                }
              ],
              "kanbanSettings": {
                "tasks": {
                  "foldWorkflows": [

                  ],
                  "countPerPage": 10
                },
                "applications": {
                  "foldWorkflows": [

                  ],
                  "countPerPage": 10
                },
                "opportunities": {
                  "foldWorkflows": [
                    "528cdef4f3f67bc40b00000a",
                    "528cdf1cf3f67bc40b00000b"
                  ],
                  "countPerPage": 10
                }
              },
              "credentials": {
                "access_token": "",
                "refresh_token": ""
              },
              "pass": "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
              "email": "info@thinkmobiles.com",
              "login": "alex.sokhanych",
              "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
              "__v": 0,
              "lastAccess": "2016-07-07T14:41:05.162Z",
              "relatedEmployee": null
            },
            "date": "2016-05-19T09:08:39.443Z"
          },
          "createdBy": {
            "user": {
              "_id": "55b9fc0fd79a3a3439000008",
              "profile": 1387275598000,
              "kanbanSettings": {
                "tasks": {
                  "foldWorkflows": [

                  ],
                  "countPerPage": 10
                },
                "applications": {
                  "foldWorkflows": [

                  ],
                  "countPerPage": 10
                },
                "opportunities": {
                  "foldWorkflows": [
                    "Empty"
                  ],
                  "countPerPage": 10
                }
              },
              "credentials": {
                "access_token": "",
                "refresh_token": ""
              },
              "pass": "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
              "email": "peter.voloshchuk@thinkmobiles.com",
              "login": "peter.volosh",
              "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
              "__v": 0,
              "lastAccess": "2016-07-08T16:37:21.370Z",
              "savedFilters": [
                {
                  "_id": "574d8475e39a499b52ca80d4",
                  "contentType": null,
                  "byDefault": false
                },
                {
                  "_id": "574d8497395dee7f52e348d0",
                  "contentType": null,
                  "byDefault": true
                },
                {
                  "_id": "574eec34cafdf9d135cfd674",
                  "contentType": null,
                  "byDefault": true
                },
                {
                  "_id": "577a546b0a8bdaf820f7bdfb",
                  "contentType": null,
                  "byDefault": false
                }
              ],
              "relatedEmployee": null
            },
            "date": "2016-04-20T11:21:00.114Z"
          },
          "StartDate": "2016-04-05T22:00:00.000Z",
          "EndDate": "2016-04-06T06:00:00.000Z",
          "logged": 7,
          "tags": [
            ""
          ],
          "progress": 88,
          "estimated": 8,
          "sequence": 0,
          "taskCount": 1
        }
      ]
}
     */
    router.get('/', handler.getTasks);

    /**
     *@api {post} /tasks/ Request for creating new Task
     *
     * @apiVersion 0.0.1
     * @apiName createTask
     * @apiGroup Tasks
     *
     * @apiParamExample {json} Request-Example:
{
    "type": "Task",
    "summary": "FixOpportunity",
    "assignedTo": "55b92ad221e4b7c40f000030",
    "workflow": "528ce0cdf3f67bc40b00000c",
    "project": "56e689c75ec71b00429745a9",
    "description": "",
    "priority": "P3",
    "StartDate": "1 Jul, 2016",
    "estimated": "2",
    "logged": "1"
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 201 Created
{
    "success":"New Task created success",
    "id":"578c86167c8fe150182f1b64"
}
     */
    router.post('/', handler.createTask);

    /**
     *@api {post} /tasks/uploadFiles/ Request for updating Task and uploading Files
     *
     * @apiVersion 0.0.1
     * @apiName uploadFiles
     * @apiGroup Tasks
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String} modelname="Tasks"
     *
     * @apiSuccess {Object} Updated Task
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "Tasks updated success",
      "data": {
        "_id": "5717661c2c8b789c7a0bb82d",
        "summary": "Testing",
        "__v": 0,
        "description": "",
        "editedBy": {
          "date": "2016-05-19T09:08:39.443Z",
          "user": "563f673270bbc2b740ce89ae"
        },
        "attachments": [
          {
            "_id": "578c86fd7c8fe150182f1b65",
            "name": "soedinennye-shtaty-nyu-york-65.jpg",
            "shortPas": "uploads%2Ftasks%2F5717661c2c8b789c7a0bb82d%2Fsoedinennye-shtaty-nyu-york-65.jpg",
            "size": "0.544&nbsp;Mb",
            "uploadDate": "2016-07-18T07:36:29.257Z",
            "uploaderName": "admin"
          }
        ],
        "notes": [
    
        ],
        "createdBy": {
          "date": "2016-04-20T11:21:00.114Z",
          "user": "55b9fc0fd79a3a3439000008"
        },
        "progress": 88,
        "remaining": 1,
        "logged": 7,
        "estimated": 8,
        "type": "Task",
        "workflow": "528ce35af3f67bc40b000010",
        "duration": 1,
        "EndDate": "2016-04-06T06:00:00.000Z",
        "StartDate": "2016-04-05T22:00:00.000Z",
        "customer": null,
        "sequence": 0,
        "priority": "P3",
        "tags": [
          ""
        ],
        "assignedTo": "55b92ad221e4b7c40f000090",
        "project": "56e689c75ec71b00429745a9",
        "taskCount": 1
      }
}
     */
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {patch} /tasks/:id Request for partly updating Task
     *
     * @apiVersion 0.0.1
     * @apiName updateTask
     * @apiGroup Tasks
     *
     * @apiParam {String} id Unique id of Task
     * @apiParamExample {json} Request-Example:
{
      "type": "Task",
      "summary": "Testing",
      "assignedTo": "55b92ad221e4b7c40f000090",
      "tags": [
        ""
      ],
      "description": "",
      "priority": "P3",
      "StartDate": "22 Jul, 2016",
      "estimated": 8,
      "logged": 7,
      "sequenceStart": 0
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": "Tasks updated",
      "notes": [
    
      ],
      "sequence": 0
}
     */
    router.patch('/:_id', handler.taskUpdateOnlySelectedFields);

    /**
     *@api {delete} /tasks/:id Request for deleting chosen Task
     *
     * @apiVersion 0.0.1
     * @apiName deleteTask
     * @apiGroup Tasks
     *
     * @apiParam {String} id Unique id of Task
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Success removed"
}
     */
    router.delete('/:_id', handler.removeTask);

    /**
     *@api {delete} /tasks/ Request for deleting selected Tasks
     *
     * @apiVersion 0.0.1
     * @apiName deleteTasks
     * @apiGroup Tasks
     *
     * @apiParamExample {json} Request-Example:
{
    "contentType": "Tasks",
    "ids": [
        "578c891a7c8fe150182f1b66",
        "578c86167c8fe150182f1b64"
    ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":true
}
     */
    router.delete('/', accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
