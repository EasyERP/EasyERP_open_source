var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var moduleId = MODULES.EMPLOYEES;
    var handler = new EmployeeHandler(event, models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    router.use(authStackMiddleware);

    /**
     *@api {get} /employees/ Request Employees
     *
     * @apiVersion 0.0.1
     * @apiName getEmployees
     * @apiGroup Employee
     *
     * @apiParam (?Field=value) {String} viewType="thumbnails" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=50 Count of Employees which will show
     * @apiParam (?Field=value) {String} contentType="Employees" Type of content
     *
     * @apiSuccess {Object} Employees
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
    "total": 231,
    "data": [
        {
            "_id": "577caddabfecefaf11e473e5",
            "total": 231,
            "jobPosition": {
                "_id": "56e6b8b9701f50ac4d0a4974",
                "name": "Copywriter"
            },
            "manager": {
                "_id": "55b92ad221e4b7c40f000084",
                "name": {
                    "last": "Dahno",
                    "first": "Alex"
                }
            },
            "age": 18,
            "relatedUser": {
                "login": "AndrianaLemko"
            },
            "workPhones": {
                "mobile": ""
            },
            "name": {
                "last": "Ivanov",
                "first": "Ivan"
            },
            "department": {
                "_id": "55b92ace21e4b7c40f000015",
                "name": "HR"
            },
            "dateBirth": "1998-07-03T00:00:00.000Z",
            "isEmployee": true,
            "editedBy": {
                "date": "2016-07-06T07:06:02.199Z"
            }
        },
        {
            "_id": "577cad55bfecefaf11e473e4",
            "total": 231,
            "jobPosition": {
                "_id": "55ddd8a2f09cc2ec0b000030",
                "name": "CSS"
            },
            "manager": {
                "_id": "564dac3e9b85f8b16b574fea",
                "name": {
                    "last": "Filchak",
                    "first": "Alex"
                }
            },
            "age": 18,
            "relatedUser": {
                "login": "admin"
            },
            "workPhones": {
                "mobile": ""
            },
            "name": {
                "last": "Ivanov",
                "first": "Petya"
            },
            "dateBirth": "1998-07-02T00:00:00.000Z",
            "isEmployee": true,
            "editedBy": {
                "date": "2016-07-06T07:03:49.914Z"
            }
        },
       ...
    ]
}
     * */
    router.get('/', accessStackMiddleware, handler.getByViewTpe);
    router.get('/getForProjectDetails', accessStackMiddleware, handler.getForProjectDetails);

    /**
     *@api {get} /employees/getForDD/ Request Employees for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getEmployeesForDropDown
     * @apiGroup Employee
     *
     * @apiParam (?Field=value) {Boolean} isEmployee=true
     *
     * @apiSuccess {Object} EmployeesForDD
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 304 Not Modified
     *{
  "data": [
    {
      "_id": "55b92ad221e4b7c40f000030",
      "department": {
        "_id": "55bb1f40cb76ca630b000007",
        "sequence": 4,
        "nestingLevel": 1,
        "editedBy": {
          "date": "2016-03-30T11:20:27.579Z",
          "user": "52203e707d4dba8813000003"
        },
        "createdBy": {
          "date": "2015-07-31T07:09:52.155Z",
          "user": "52203e707d4dba8813000003"
        },
        "users": [

        ],
        "departmentManager": "55b92ad221e4b7c40f000030",
        "parentDepartment": "56e6775c5ec71b00429745a4",
        "__v": 0,
        "isDevelopment": false,
        "name": "PM"
      },
      "name": {
        "first": "Alex",
        "last": "Svatuk"
      },
      "isEmployee": true
    },
    {
      "_id": "55b92ad221e4b7c40f00004f",
      "department": {
        "_id": "55b92ace21e4b7c40f000014",
        "ID": 6,
        "sequence": 1,
        "nestingLevel": 1,
        "editedBy": {
          "date": "2016-03-14T08:34:00.655Z",
          "user": "52203e707d4dba8813000003"
        },
        "createdBy": {
          "date": "2015-07-29T19:34:38.909Z",
          "user": "52203e707d4dba8813000003"
        },
        "users": [

        ],
        "departmentManager": null,
        "parentDepartment": "56e6775c5ec71b00429745a4",
        "__v": 0,
        "isDevelopment": false,
        "name": "BusinessDev"
      },
      "name": {
        "last": "Sokhanych",
        "first": "Alex"
      },
      "isEmployee": true
    },
    ...
    ]
    }
     * */
    router.get('/getForDD', handler.getForDD);

    router.get('/bySales', accessStackMiddleware, handler.getBySales);
    router.get('/byDepartment', accessStackMiddleware, handler.byDepartment);
    router.get('/exportToXlsx', accessStackMiddleware, handler.exportToXlsx);
    // router.get('/exportToCsv', accessStackMiddleware, handler.exportToCsv);

    router.get('/getForDdByRelatedUser', accessStackMiddleware, handler.getForDdByRelatedUser);

    /**
     *@api {get} /employees/getPersonsForDd/ Request Persons for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getPersonsForDd
     * @apiGroup Employee
     *
     * @apiSuccess {Object} PersonsForDd
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 304 Not Modified
     *     {
          "data": [
            {
              "_id": "55b92ad221e4b7c40f000030",
              "name": {
                "last": "Svatuk",
                "first": "Alex"
              },
              "fullName": "Alex Svatuk",
              "id": "55b92ad221e4b7c40f000030"
            },
            {
              "_id": "55b92ad221e4b7c40f000031",
              "name": {
                "last": "Gleba",
                "first": "Alex"
              },
              "fullName": "Alex Gleba",
              "id": "55b92ad221e4b7c40f000031"
            },
            ...
            ]
            }
             * */
    router.get('/getPersonsForDd', accessStackMiddleware, handler.getSalesPerson);
    router.get('/getEmployeesAlphabet', accessStackMiddleware, handler.getEmployeesAlphabet);
    router.get('/getEmployeesImages', accessStackMiddleware, handler.getEmployeesImages);
    router.get('/nationality', accessStackMiddleware, handler.getNationality);
    router.get('/languages', accessStackMiddleware, handler.getLanguages);
    router.get('/sources', handler.getSources);
    /* router.get('/getByMonth', accessStackMiddleware, handler.getSalaryByMonth);*/

    router.get('/birthdays', accessStackMiddleware, handler.getBirthdays);
    router.get('/getYears', handler.getYears);

    /**
     *@api {get} /employees/getEmployeesCount/ Request Employees count
     *
     * @apiVersion 0.0.1
     * @apiName getEmployeesCount
     * @apiGroup Employee
     *
     * @apiParam (?Field=value) {Number} month
     * @apiParam (?Field=value) {Number} year
     *
     * @apiSuccess {Object} EmployeesCount
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 304 Not Modified
     *     {
     *      "count":231
     *     }
     *
     * */
    router.get('/getEmployeesCount', handler.getEmployeesCount);

    /**
     *@api {get} /employees/EmployeesForChart/ Request EmployeesForChart
     *
     * @apiVersion 0.0.1
     * @apiName getEmployeesForChart
     * @apiGroup Employee
     *
     * @apiSuccess {Object} EmployeesForChart
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     {
       "_id": "Finance",
       "employeesCount": 3,
       "maleCount": 1,
       "femaleCount": 2
     },
     {
       "_id": "Marketing",
       "employeesCount": 7,
       "maleCount": 2,
       "femaleCount": 5
     },
     ...
     ]
     *
     * */
    router.get('/EmployeesForChart', handler.getEmployeesForChart);

    /**
     *@api {get} /employees/byDepartmentForChart/ Request EmployeesByDepartmentForChart
     *
     * @apiVersion 0.0.1
     * @apiName getEmployeesByDepartmentForChart
     * @apiGroup Employee
     *
     * @apiSuccess {Object} EmployeesByDepartmentForChart
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
  "_id": null,
  "name": "Departments",
  "children": [
    {
      "_id": "56e6775c5ec71b00429745a4",
      "departments": [
        {
          "_id": "560c0b83a5d4a2e20ba5068c",
          "name": "Finance",
          "employees": [
            {
              "_id": "56014cc8536bd29228000007",
              "name": "Yevgenia Bezyk"
            },
            {
              "_id": "56cdd88b541812c071973585",
              "name": "Nelya Plovayko"
            },
            {
              "_id": "56cf0928541812c071973593",
              "name": "Tetiana Shepitko"
            }
          ],
          "parentDepartment": "56e6775c5ec71b00429745a4"
        },
        {
          "_id": "55bb1f40cb76ca630b000007",
          "name": "PM",
          "employees": [
            {
              "_id": "55b92ad221e4b7c40f000030",
              "name": "Alex Svatuk"
            },
            {
              "_id": "55b92ad221e4b7c40f000086",
              "name": "Roman Kubichka"
            },
            ...
          ],
          "parentDepartment": "56e6775c5ec71b00429745a4"
        },
        {
          "_id": "55b92ace21e4b7c40f000015",
          "name": "HR",
          "employees": [
            {
              "_id": "55b92ad221e4b7c40f00003f",
              "name": "Marina Kubichka"
            },
            {
              "_id": "55b92ad221e4b7c40f000073",
              "name": "Irina Grab"
            },
            ...
          ],
          "parentDepartment": "56e6775c5ec71b00429745a4"
        },
        {
          "_id": "55b92ace21e4b7c40f000014",
          "name": "BusinessDev",
          "employees": [
            {
              "_id": "55b92ad221e4b7c40f000040",
              "name": "Vasiliy Almashiy"
            },
            {
              "_id": "55b92ad221e4b7c40f00004f",
              "name": "Alex Sokhanych"
            },
            ...
          ],
          "parentDepartment": "56e6775c5ec71b00429745a4"
        },
        {
          "_id": "55b92ace21e4b7c40f000013",
          "name": "Marketing",
          "employees": [
            {
              "_id": "55f9298456f79c9c0c000006",
              "name": "Viktor Manhur"
            },
            {
              "_id": "5626278d750d38934bfa1313",
              "name": "Viktoria Rogachenko"
            },
            ...
          ],
          "parentDepartment": "56e6775c5ec71b00429745a4"
        }
      ],
      "name": "Service"
    }
  ]
}
     * */
    router.get('/byDepartmentForChart', handler.byDepartmentForChart);

    /**
     *@api {post} /employees/ Request for creating Employee
     *
     * @apiVersion 0.0.1
     * @apiName createNewEmployee
     * @apiGroup Employee
     *
     * @apiParamExample {json} Request-Example:
     * {
  "isEmployee": true,
  "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
  "name": {
    "first": "David",
    "last": "Silva"
  },
  "gender": "male",
  "marital": "married",
  "tags": [
    ""
  ],
  "workAddress": {
    "street": "",
    "city": "",
    "state": "",
    "zip": "",
    "country": ""
  },
  "workEmail": "david.work@gmail.com",
  "personalEmail": "david@gmail.com",
  "workPhones": {
    "phone": "0500090999",
    "mobile": "0506677044"
  },
  "skype": "",
  "officeLocation": "",
  "relatedUser": null,
  "visibility": "Public",
  "department": "57835523828f9c302171c2eb",
  "jobPosition": "55eeeddd6dceaee10b00001f",
  "nationality": "British",
  "identNo": "",
  "passportNo": "",
  "bankAccountNo": "",
  "otherId": "",
  "homeAddress": {
    "street": "",
    "city": "",
    "state": "",
    "zip": "",
    "country": ""
  },
  "source": "www.rabota.ua",
  "dateBirth": "3 Jul, 1998",
  "hire": [
    "2016-07-10T21:00:00.000Z"
  ],
  "fire": [
    "2016-07-10T21:00:00.000Z"
  ],
  "notes": [

  ],
  "jobType": "Full-time",
  "social": {
    "LI": "",
    "FB": ""
  },
  "manager": "55b92ad221e4b7c40f000044",
  "coach": null,
  "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
  "lastFire": 201628,
  "groups": {
    "owner": null,
    "users": [

    ],
    "group": [

    ]
  },
  "whoCanRW": "everyOne",
  "transfer": [
    {
      "status": "hired",
      "date": "2016-07-10T21:00:00.000Z",
      "department": "57835523828f9c302171c2eb",
      "jobPosition": "55eeeddd6dceaee10b00001f",
      "manager": "55b92ad221e4b7c40f000044",
      "jobType": "Full-time",
      "salary": 0,
      "info": "",
      "weeklyScheduler": "57332c3b94ee1140b6bb49e2"
    }
  ]
}
     *
     * @apiSuccess {Object} NewEmployee Just created Employee
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
  "success": "A new Employees create success",
  "result": {
    "__v": 0,
    "identNo": "",
    "passportNo": "",
    "dateBirth": "1998-07-03T00:00:00.000Z",
    "_id": "578385a2f6a68a7d3b37eab6",
    "lastFire": 201628,
    "transfer": [
      {
        "isDeveloper": false,
        "date": "2016-07-10T21:00:00.000Z",
        "info": "",
        "salary": 0,
        "jobType": "Full-time",
        "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
        "manager": "55b92ad221e4b7c40f000044",
        "jobPosition": "55eeeddd6dceaee10b00001f",
        "department": "57835523828f9c302171c2eb",
        "status": "hired"
      }
    ],
    "fire": [
      "2016-07-10T21:00:00.000Z"
    ],
    "hire": [
      "2016-07-10T21:00:00.000Z"
    ],
    "social": {
      "GP": "",
      "LI": "",
      "FB": ""
    },
    "sequence": 247,
    "jobType": "Full-time",
    "gender": "male",
    "marital": "married",
    "contractEnd": {
      "date": "2016-07-11T11:40:18.318Z",
      "reason": ""
    },
    "notes": [

    ],
    "attachments": [

    ],
    "editedBy": {
      "date": "2016-07-11T11:40:18.336Z",
      "user": "52203e707d4dba8813000003"
    },
    "createdBy": {
      "date": "2016-07-11T11:40:18.336Z",
      "user": "52203e707d4dba8813000003"
    },
    "creationDate": "2016-07-11T11:40:18.318Z",
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
    "workflow": null,
    "referredBy": "",
    "source": "www.rabota.ua",
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
    "nationality": "British",
    "coach": null,
    "manager": "55b92ad221e4b7c40f000044",
    "weeklyScheduler": "57332c3b94ee1140b6bb49e2",
    "jobPosition": "55eeeddd6dceaee10b00001f",
    "department": "57835523828f9c302171c2eb",
    "visibility": "Public",
    "relatedUser": null,
    "officeLocation": "",
    "skype": "",
    "workPhones": {
      "phone": "0500090999",
      "mobile": "0506677044"
    },
    "personalEmail": "david@gmail.com",
    "workEmail": "david.work@gmail.com",
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
      "last": "Silva",
      "first": "David"
    },
    "subject": "",
    "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
    "isEmployee": true,
    "fullName": "David Silva",
    "id": "578385a2f6a68a7d3b37eab6"
  },
  "id": "578385a2f6a68a7d3b37eab6"
}
     */
    router.post('/', accessStackMiddleware, handler.create);
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);
    router.patch('/:id', accessStackMiddleware, handler.updateOnlySelectedFields);

    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
