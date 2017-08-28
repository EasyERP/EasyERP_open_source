var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new EmployeeHandler(event, models);
    var moduleId = MODULES.APPLICATIONS;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'employees', event);
    }

    router.use(authStackMiddleware);

    /**
     * @api {get} /applications/ Request Applications
     *
     * @apiVersion 0.0.1
     * @apiName getApplications
     * @apiGroup Applications
     *
     * @apiParam (?Field=value) {String} workflowId Workflow unique ID.
     * @apiParam (?Field=value) {String} viewType="kanban" Type of View.
     *
     * @apiSuccess {Object} Applications which belong to some workflow
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
            {
                "_id": "56e6b7d7977124d34db5829c",
                "sequence": 0,
                "editedBy": {
                    "date": "2016-07-04T14:48:13.217Z"
                },
                "workflow": {
                    "_id": "528ce61bf3f67bc40b000019"
                },
                "jobPosition": {
                    "_id": "566ee0c68453e8b464b70b72",
                    "name": "Junior Ruby on Rails"
                },
                "name": {
                    "last": "Bachynska",
                    "first": "Roksana"
                },
                "fullName": "Roksana Bachynska",
                "id": "56e6b7d7977124d34db5829c"
            },
            ...
         ],
         "workflowId": "528ce61bf3f67bc40b000019",
         "time": 191,
         "fold": false
     }
     */
    router.get('/', accessStackMiddleWare, handler.getByViewTpe);

    router.get('/exportToXlsx', accessStackMiddleWare, handler.exportToXlsx);
    router.get('/exportToCsv', accessStackMiddleWare, handler.exportToCsv);

    /**
     * @api {get} /applications/getApplicationsLengthByWorkflows Request applications length by workflows
     *
     * @apiVersion 0.0.1
     * @apiName getApplicationsLengthByWorkflows
     * @apiGroup Applications
     *
     * @apiSuccess {Object} ApplicationsLengthByWorkflows length by workflows
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "showMore": true,
         "arrayOfObjects": [
             {
                 "_id": "528ce61bf3f67bc40b000019",
                 "count": 1
             },
             {
                 "_id": null,
                 "count": 17
             },
             {
                 "_id": "52d2c1369b57890814000005",
                 "count": 84
             },
             ...
         ]
     }
     */
    router.get('/getApplicationsLengthByWorkflows', handler.getCollectionLengthByWorkflows);

    router.post('/uploadFiles', accessStackMiddleWare, multipartMiddleware, handler.uploadFile);

    /**
     * @api {post} /applications/ Request for creating new application
     *
     * @apiVersion 0.0.1
     * @apiName CreateNewApplication
     * @apiGroup Applications
     *
     *  @apiParamExample {json} Request-Example:
     {
       "isEmployee": false,
       "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       "subject": "",
       "name": {
         "first": "Vasya",
         "last": "Pupkin"
       },
       "tags": [
         ""
       ],
       "personalEmail": "vasya0984@gmail.com",
       "workPhones": {
         "phone": "0500090999",
         "mobile": "0990080459"
       },
       "relatedUser": null,
       "department": "55b92ace21e4b7c40f000010",
       "jobPosition": "5603a84fa5ac49794e00001a",
       "nextAction": "8 Jul, 2016",
       "referredBy": "",
       "expectedSalary": "500",
       "proposedSalary": 400,
       "otherInfo": "",
       "workflow": "528ce51cf3f67bc40b000015",
       "notes": [

       ],
       "gender": "male",
       "jobType": "fullTime",
       "marital": "married",
       "workAddress": {
         "street": "",
         "city": "",
         "state": "",
         "zip": "",
         "country": ""
       },
       "social": {
         "LI": "pupkin",
         "FB": ""
       },
       "workEmail": "vasyiliy.pupkin@thinkmobiles.com",
       "skype": "pupkin",
       "bankAccountNo": "",
       "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
       "manager": null,
       "identNo": "",
       "passportNo": "",
       "otherId": "",
       "homeAddress": {
         "street": "",
         "city": "",
         "state": "",
         "zip": "",
         "country": ""
       },
       "dateBirth": "2 Jul, 1998",
       "groups": {
         "owner": null,
         "users": [

         ],
         "group": [

         ]
       },
       "whoCanRW": "everyOne"
     }
     * @apiSuccess {Object} NewApplication Just created new application
     * @apiSuccessExample Success-Response:
     HTTP/1.1 201 Created
     {
       "success": "A new Employees create success",
       "result": {
         "__v": 0,
         "nextAction": "2016-07-07T21:00:00.000Z",
         "expectedSalary": 500,
         "proposedSalary": 400,
         "identNo": "",
         "passportNo": "",
         "dateBirth": "1998-07-02T00:00:00.000Z",
         "_id": "577e59c98286c89d37076872",
         "lastFire": null,
         "transfer": [

         ],
         "fire": [

         ],
         "hire": [

         ],
         "social": {
           "GP": "",
           "LI": "pupkin",
           "FB": ""
         },
         "sequence": 1,
         "jobType": "fullTime",
         "gender": "male",
         "marital": "married",
         "contractEnd": {
           "date": "2016-07-07T13:31:53.393Z",
           "reason": ""
         },
         "notes": [

         ],
         "attachments": [

         ],
         "editedBy": {
           "date": "2016-07-07T13:31:53.410Z",
           "user": "52203e707d4dba8813000003"
         },
         "createdBy": {
           "date": "2016-07-07T13:31:53.410Z",
           "user": "52203e707d4dba8813000003"
         },
         "creationDate": "2016-07-07T13:31:53.393Z",
         "color": "#4d5a75",
         "otherInfo": "",
         "groups": {
           "group": [

           ],
           "users": [

           ],
           "owner": null
         },
         "whoCanRW": "everyOne",
         "workflow": "528ce51cf3f67bc40b000015",
         "referredBy": "",
         "source": "",
         "age": 18,
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
         "manager": null,
         "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
         "jobPosition": "5603a84fa5ac49794e00001a",
         "department": "55b92ace21e4b7c40f000010",
         "visibility": "Public",
         "relatedUser": null,
         "officeLocation": "",
         "skype": "pupkin",
         "workPhones": {
           "phone": "0500090999",
           "mobile": "0990080459"
         },
         "personalEmail": "vasya0999@gmail.com",
         "workEmail": "vasyiliy.pupkin@thinkmobiles.com",
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
           "last": "Pupkin",
           "first": "Vasya"
         },
         "subject": "",
         "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
         "isEmployee": false,
         "fullName": "Vasya Pupkin",
         "id": "577e59c98286c89d37076872"
       },
       "id": "577e59c98286c89d37076872"
     }
     */
    router.post('/', accessStackMiddleWare, handler.create);

    /**
     * @api {patch} /applications/:id Request for updating only selected fields on choosen Application
     *
     * @apiVersion 0.0.1
     * @apiName UpdateApplication
     * @apiGroup Applications
     *
     * @apiParam {String} id Uniaue id of application
     * @apiParamExample {json} Request-Example:
     {
       "name": {
         "first": "Vasya",
         "last": "Pupkin"
       },
       "gender": "male",
       "jobType": "fullTime",
       "marital": "married",
       "workAddress": {
         "street": "",
         "city": "",
         "state": "",
         "zip": "",
         "country": ""
       },
       "social": {
         "LI": "pupkin",
         "FB": ""
       },
       "tags": [
         ""
       ],
       "workEmail": "vasyiliy.pupkin@thinkmobiles.com",
       "personalEmail": "vasya0984@gmail.com",
       "skype": "pupkin",
       "workPhones": {
         "phone": "0500090999",
         "mobile": "0990080459"
       },
       "officeLocation": "",
       "bankAccountNo": "",
       "relatedUser": null,
       "department": "55b92ace21e4b7c40f000010",
       "jobPosition": "5603a84fa5ac49794e00001a",
       "manager": "55b92ad221e4b7c40f000057",
       "coach": null,
       "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
       "identNo": "",
       "passportNo": "",
       "otherId": "",
       "homeAddress": {
         "street": "",
         "city": "",
         "state": "",
         "zip": "",
         "country": ""
       },
       "dateBirth": "02 Jul, 1998",
       "source": "",
       "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       "nationality": "",
       "isEmployee": false,
       "groups": {
         "owner": null,
         "users": [
           "55ba28c8d79a3a3439000016"
         ],
         "group": [
           "5774f89ed2658cb5213523a6"
         ]
       },
       "whoCanRW": "everyOne",
       "hire": [

       ],
       "fire": [

       ],
       "nextAction": "08 Jul, 2016",
       "transfer": [

       ],
       "expectedSalary": 500,
       "proposedSalary": 500
     }
     * @apiSuccess {Object} PartlyUpdatedApplication Just updated chosen fields in Application
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "_id": "577e59c98286c89d37076872",
       "nextAction": "2016-07-07T21:00:00.000Z",
       "expectedSalary": 500,
       "proposedSalary": 500,
       "identNo": "",
       "passportNo": "",
       "dateBirth": "1998-07-01T21:00:00.000Z",
       "__v": 0,
       "lastFire": null,
       "transfer": [

       ],
       "fire": [

       ],
       "hire": [

       ],
       "social": {
         "GP": "",
         "LI": "pupkin",
         "FB": ""
       },
       "sequence": 1,
       "jobType": "fullTime",
       "gender": "male",
       "marital": "married",
       "contractEnd": {
         "date": "2016-07-07T13:31:53.393Z",
         "reason": ""
       },
       "notes": [

       ],
       "attachments": [

       ],
       "editedBy": {
         "date": "2016-07-07T13:55:34.430Z",
         "user": "52203e707d4dba8813000003"
       },
       "createdBy": {
         "date": "2016-07-07T13:31:53.410Z",
         "user": "52203e707d4dba8813000003"
       },
       "creationDate": "2016-07-07T13:31:53.393Z",
       "color": "#4d5a75",
       "otherInfo": "",
       "groups": {
         "group": [
           "5774f89ed2658cb5213523a6"
         ],
         "users": [
           "55ba28c8d79a3a3439000016"
         ],
         "owner": null
       },
       "whoCanRW": "everyOne",
       "workflow": "528ce51cf3f67bc40b000015",
       "referredBy": "",
       "source": "",
       "age": 18,
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
       "manager": "55b92ad221e4b7c40f000057",
       "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
       "jobPosition": "5603a84fa5ac49794e00001a",
       "department": "55b92ace21e4b7c40f000010",
       "visibility": "Public",
       "relatedUser": null,
       "officeLocation": "",
       "skype": "pupkin",
       "workPhones": {
         "phone": "0500090999",
         "mobile": "0990080459"
       },
       "personalEmail": "vasya0984@gmail.com",
       "workEmail": "vasyiliy.pupkin@thinkmobiles.com",
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
         "last": "Pupkin",
         "first": "Vasya"
       },
       "subject": "",
       "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       "isEmployee": false,
       "fullName": "Vasya Pupkin",
       "id": "577e59c98286c89d37076872"
     }
     */
    router.patch('/:id', accessStackMiddleWare, handler.updateOnlySelectedFields);

    /**
     * @api {delete} /applications/:id Delete Employee
     * @apiVersion 0.0.1
     * @apiName DeleteEmployee
     * @apiGroup Applications
     *
     * @apiParam {String} id Employee unique ID.
     *
     * @apiSuccess (200) {Object} Status Deleted Employee
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "success": "customer removed"
     }
     */
    router.delete('/:id', accessStackMiddleWare, handler.remove);

    /**
     * @api {delete} /applications/ Request for deleting a few Applications
     *
     * @apiVersion 0.0.1
     * @apiName deleteFewApplications
     * @apiGroup Applications
     *
     * @apiParamExample {json} Request-Example:
     *{
      "contentType": "Applications",
      "ids": [
        "55b92ad221e4b7c40f00004b",
        "56b9d3eb8f23c5696159cd0b"
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
    router.delete('/', accessStackMiddleWare, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
