var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';

    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.COMPANIES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /customers/ Request Customers
     *
     * @apiVersion 0.0.1
     * @apiName getCustomers
     * @apiGroup Customers
     *
     * @apiSuccess {Object} Customers
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
        "data": [
        {
            "_id": "55b92ad521e4b7c40f000611",
            "companyInfo": {
                "industry": null
            },
            "editedBy": {
                "date": "2016-07-08T14:20:10.766Z",
                "user": null
            },
            "createdBy": {
                "date": "2016-07-08T14:20:10.766Z",
                "user": null
            },
            "history": [],
            "attachments": [],
            "notes": [],
            "groups": {
                "group": [],
                "users": [],
                "owner": null
            },
            "whoCanRW": "everyOne",
            "social": {
                "LI": "",
                "FB": ""
            },
            "color": "#4d5a75",
            "relatedUser": null,
            "salesPurchases": {
                "receiveMessages": 0,
                "language": "English",
                "reference": "",
                "active": true,
                "implementedBy": null,
                "salesTeam": null,
                "salesPerson": null,
                "isSupplier": false,
                "isCustomer": true
            },
            "title": "",
            "internalNotes": "",
            "contacts": [],
            "phones": {
                "fax": "",
                "mobile": "",
                "phone": ""
            },
            "skype": "",
            "jobPosition": "",
            "website": "",
            "address": {
                "country": "",
                "zip": "",
                "state": "",
                "city": "",
                "street": ""
            },
            "timezone": "UTC",
            "department": null,
            "company": null,
            "email": "",
            "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
            "name": {
                "last": "",
                "first": "demo"
            },
            "isOwn": false,
            "type": "",
            "fullName": "demo ",
            "id": "55b92ad521e4b7c40f000611"
        },
        ...
        ]
      }
     */
    router.get('/', handler.getByViewType);

    /**
     *@api {get} /customers/getCustomersImages/ Request CustomersImages
     *
     * @apiVersion 0.0.1
     * @apiName getCustomersImages
     * @apiGroup Customers
     *
     * @apiParam (?Field=value) {String} ids Unique Id of Customer
     *
     * @apiSuccess {Object} CustomersImages
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
             {
                 "_id": "55b92ad521e4b7c40f000611",
                 "companyInfo": {
                     "industry": null
                 },
                 "editedBy": {
                     "date": "2016-07-08T14:20:10.766Z",
                     "user": null
                 },
                 "createdBy": {
                     "date": "2016-07-08T14:20:10.766Z",
                     "user": null
                 },
                 "history": [],
                 "attachments": [],
                 "notes": [],
                 "groups": {
                     "group": [],
                     "users": [],
                     "owner": null
                 },
                 "whoCanRW": "everyOne",
                 "social": {
                     "LI": "",
                     "FB": ""
                 },
                 "color": "#4d5a75",
                 "relatedUser": null,
                 "salesPurchases": {
                     "receiveMessages": 0,
                     "language": "English",
                     "reference": "",
                     "active": true,
                     "implementedBy": null,
                     "salesTeam": null,
                     "salesPerson": null,
                     "isSupplier": false,
                     "isCustomer": true
                 },
                 "title": "",
                 "internalNotes": "",
                 "contacts": [],
                 "phones": {
                     "fax": "",
                     "mobile": "",
                     "phone": ""
                 },
                 "skype": "",
                 "jobPosition": "",
                 "website": "",
                 "address": {
                     "country": "",
                     "zip": "",
                     "state": "",
                     "city": "",
                     "street": ""
                 },
                 "timezone": "UTC",
                 "department": null,
                 "company": null,
                 "email": "",
                 "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                 "name": {
                     "last": "",
                     "first": "demo"
                 },
                 "isOwn": false,
                 "type": "",
                 "fullName": "demo ",
                 "id": "55b92ad521e4b7c40f000611"
             },
             ...
         ]
     }
     */
    router.get('/getCustomersImages', handler.getCustomersImages);

    /**
     *@api {get} /customers/getCompaniesForDd Request Customers for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getCustomersForDropDown
     * @apiGroup Customers
     *
     * @apiSuccess {Object} Customers for dropDown
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
             {
                 "_id": "55ba0301d79a3a343900000d",
                 "name": {
                     "first": "#Play"
                 },
                 "fullName": "#Play undefined",
                 "id": "55ba0301d79a3a343900000d"
             },
             {
                 "_id": "5721d153dce306912118af85",
                 "name": {
                     "first": "AVANT WEB SOLUTIONS"
                 },
                 "fullName": "AVANT WEB SOLUTIONS undefined",
                 "id": "5721d153dce306912118af85"
             },
             ...
         ]
     }
     */
    router.get('/getCompaniesForDd', handler.getCompaniesForDd);

    /**
     *@api {get} /customers/getCompaniesAlphabet/ Request CompaniesAlphabet
     *
     * @apiVersion 0.0.1
     * @apiName getCompaniesAlphabet
     * @apiGroup Customers
     *
     * @apiParam (?Field=value) {Number} mid Number of module
     * @apiParam (?Field=value) {String="ownCompanies", "Companies", "Persons"} contentType Type of content
     *
     * @apiSuccess {Object} CompaniesAlphabet
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
          {
              "_id": "e"
          },
          {
              "_id": "Z"
          },
          {
              "_id": "E"
          },
          {
              "_id": "H"
          },
          {
              "_id": "U"
          },
          {
              "_id": "Q"
          },
          {
              "_id": "J"
          },
          {
              "_id": "K"
          },
          {
              "_id": "N"
          },
          {
              "_id": "P"
          },
          {
              "_id": "C"
          },
          {
              "_id": "B"
          },
          {
              "_id": "O"
          },
          {
              "_id": "L"
          },
          {
              "_id": "S"
          },
          {
              "_id": "A"
          },
          {
              "_id": "#"
          },
          {
              "_id": "G"
          },
          {
              "_id": "M"
          },
          {
              "_id": "Y"
          },
          {
              "_id": "T"
          },
          {
              "_id": "F"
          },
          {
              "_id": "D"
          },
          {
              "_id": "I"
          },
          {
              "_id": "W"
          },
          {
              "_id": "V"
          }
         ]
     }
     */
    router.get('/getCompaniesAlphabet', handler.getCompaniesAlphabet);
    router.get('/exportToXlsx', handler.exportToXlsx);
    router.get('/exportToCsv', handler.exportToCsv);

    /**
     *@api {get} /customers/:id Request the Customer
     *
     * @apiVersion 0.0.1
     * @apiName getCustomer
     * @apiGroup Customers
     *
     * @apiSuccess {Object} SomeCustomer
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "_id": "55b92ad521e4b7c40f00060d",
         "editedBy": {
             "date": "2016-05-31T18:43:58.387Z",
             "user": {
                 "_id": "57231ce22387d7b821a694c2",
                 "login": "ivan.pasichnyuk"
             }
         },
         "createdBy": {
             "date": "2015-07-29T19:34:45.990Z",
             "user": {
                 "_id": "52203e707d4dba8813000003",
                 "login": "admin"
             }
         },
         "attachments": [],
         "notes": [],
         "groups": {
             "group": [],
             "users": [],
             "owner": {
                 "_id": "52203e707d4dba8813000003",
                 "login": "admin"
             }
         },
         "social": {
             "LI": "",
             "FB": ""
         },
         "salesPurchases": {
             "receiveMessages": 0,
             "language": "",
             "reference": "",
             "active": false,
             "implementedBy": null,
             "salesTeam": null,
             "salesPerson": null,
             "isSupplier": false,
             "isCustomer": true
         },
         "phones": {
             "fax": "",
             "mobile": "",
             "phone": "+16162403185"
         },
         "skype": "",
         "jobPosition": "",
         "website": "http://www.sportsmantracker.com",
         "address": {
             "country": "USA",
             "zip": "49525 ",
             "state": "Michigan",
             "city": "Grand Rapids",
             "street": "4647 Shearwood Ct."
         },
         "company": null,
         "email": "jeff@sportsmantracker.com",
         "imageSrc": "data:image/jpeg;base64,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",
         "name": {
             "last": "",
             "first": "Sportsman Tracker"
         },
         "fullName": "Sportsman Tracker ",
         "id": "55b92ad521e4b7c40f00060d"
     }
     */
    router.get('/:id', handler.getById);

    /**
     *@api {post} /companies/uploadFiles Request for updating Company and uploading new files
     *
     * @apiVersion 0.0.1
     * @apiName UpdateCompanyAndUploadFiles
     * @apiGroup Customers
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String="Companies","Persons"} modelname
     *
     * @apiSuccess {Object} Company Updated company
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "success": "Customers updated success",
       "data": {
         "_id": "55b92ad521e4b7c40f00061d",
         "ID": 2,
         "__v": 0,
         "companyInfo": {
           "size": "574c54ec83569c287bf59584",
           "industry": "574c54e22b7598157b94f14c"
         },
         "editedBy": {
           "date": "2016-06-30T13:30:03.008Z",
           "user": "52203e707d4dba8813000003"
         },
         "createdBy": {
           "date": "2015-07-29T19:34:45.997Z",
           "user": "52203e707d4dba8813000003"
         },
         "history": [

         ],
         "attachments": [
           {
             "_id": "57751edbc7df8a971fd45d84",
             "name": "checkEmployeesOnWtracks.js",
             "shortPas": "uploads%2Fcompanies%2F55b92ad521e4b7c40f00061d%2FcheckEmployeesOnWtracks.js",
             "size": "0.006&nbsp;Mb",
             "uploadDate": "2016-06-30T13:30:03.316Z",
             "uploaderName": "admin",
             "noteId": "1467293402830"
           },
           {
             "_id": "577fcee05651db3a56865d9d",
             "name": "soedinennye-shtaty-nyu-york-65.jpg",
             "shortPas": "uploads%2Fcompanies%2F55b92ad521e4b7c40f00061d%2Fsoedinennye-shtaty-nyu-york-65.jpg",
             "size": "0.544&nbsp;Mb",
             "uploadDate": "2016-07-08T16:03:44.912Z",
             "uploaderName": "admin"
           }
         ],
         "notes": [
           {
             "date": "2016-06-30T13:30:03.008Z",
             "note": "sadasdsad",
             "title": "",
             "_id": "1467293402830"
           }
         ],
         "groups": {
           "group": [

           ],
           "users": [

           ],
           "owner": "52203e707d4dba8813000003"
         },
         "whoCanRW": "everyOne",
         "social": {
           "LI": "",
           "FB": ""
         },
         "color": "#4d5a75",
         "relatedUser": null,
         "salesPurchases": {
           "receiveMessages": 0,
           "language": "",
           "reference": "",
           "active": false,
           "implementedBy": null,
           "salesTeam": null,
           "salesPerson": null,
           "isSupplier": false,
           "isCustomer": true
         },
         "title": "",
         "internalNotes": "",
         "contacts": [

         ],
         "phones": {
           "fax": "",
           "mobile": "",
           "phone": "+61 3 9039 9999"
         },
         "skype": "",
         "jobPosition": "",
         "website": "http://www.buzinga.com.au/",
         "address": {
           "country": "Australia",
           "zip": "3121",
           "state": "Melbourne",
           "city": "Richmond",
           "street": "Level 1, 225 - 227 Swan St"
         },
         "timezone": "UTC",
         "department": null,
         "company": null,
         "email": "jason@buzinga.com.au",
         "imageSrc": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9Avil8UJ9BuT4d8Pyqt4FBuZ9oPk5GQqg8biOSewI79PHLzXNT1Fi9/qd1cs3UyzM38zVbxBqUmo67qF9K7M091LJknPVjgVQ80+tfx5xZxFjuI8fUqVaj9mm1GN3yqKemm131fV+Vkft+T5NQy3DRjGPvWV31b/y7IvecPWjzh61R80+tHmn1r5L2B7Hsy95w9aPOHrVHzT60eafWj2AezL3nD1o84etUfNPrR5p9aPYB7MvecPWjzh61R80+tHmn1o9gHsy95w9aPOHrVHzT60eafWj2AezL3nD1o84etUfNPrR5p9aPYB7MvecPWlS5aNg8cjKw6FTgiqHmn1o80+tNULO6F7O52egfErxV4fmVrfVZbiEHLQXLGRGHpzyv4EV9AeFPE9l4s0ODWbRSgkyskZOTG46qf6eoINfJnmn1rf0Dxxq/hyzeysJSsckplOGx8xAH8lFfpfA/HeK4erOljpyqUGtm78r6ON9lvdbddz5fPuGaeZQU8PFRqJ77XXn/mc1OczyHP8AGf50zJ9aZRXwjd3c+xSsrD8n1oyfWmUUgsPyfWjJ9aZRQFh+T60ZPrTKKAsPyfWjJ9aZRQFh+T60ZPrTKKAsPyfWjJ9aZRQFh+T60ZPrTKKAsPyfWjJ9aZRQFhu72o3e1MyfWjJ9a1saD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwDK6bwR8Pta8fPfR6LcWcTaesbSC5dl3b92Au1T/cPXHauX3e1e1/sz83fiP/AK52f85q+m4SyrD5xnNDA4pPknzXs7PSEmtfVI8jP8ZVy7LauKofFG1r+ckvyZ47f2N3pl7cadfQmK5tZGhlQkHa6nBGRweR2qCvoXUvhL4Gm8RXt94v8SLHe6tdyzW9qt0kPys52gBhuZvpxnjHeuF+J/wh/wCEKWDVdIuZ7rS5pFhl83BkgY9MkAAqemcDBwO4r0c14EzPLqVTFKKdODd7STklfRyS20s326pHHgOJ8DjKkKDbU5LTRqLfVJvzPNKK9W+KXwn8P+B/DUGs6Xe6hNNLdJAVnkQrtKOT0UHPyjvWX8I/htpfxAfU5NVvrqCOxEQVbcqGYvu5JYHgbemO9cFThHMqeaRydxXtpK6V1a1m9/RM64Z9gp4GWYpv2adttd0tvVnntFetaH8OfhbdnUbbW/GMthd2Go3NmYpbyGIlEkIRsOvOVAyRxnPTpXR6b8DPhrrKu+keK72+WIgOba8gkCk9AdqHFd+F4BzXGpOi6bb6c6v56b6dTkr8U4DDNqopq3XldvvPOvhf8Obf4hTajFPqz2QsFiYbYg5feW9SMY2frXL+ItKTQ9e1HRknMy2N1LbiQrjfsYrnHbpXsPh74SaN/wAJf4g0Kw8Sa7ZxadDaESWl4I5HMiuSHKrzjAwMdz61zvhj4NXXibxPrVrd6tKmn6VfSW0t0RumuXDHOM5GcYJY55I4PbtxPCGJlgcNhsPhf9olOpFzU7qXK5JqzdopW3628zno59h44mtXq1/3SjBqLja3Mk9923fbz8jzCivfU+DPwp1CZ9F03xTM+pRbg6R38MkqleDuTb2PUYFeaa38L9d0nxvbeCoXS5lvtr204GFaIk5dhzt27WyOenGcivIzLgvNcspxqzipxlJRvCSl7z2i7dW9PU78FxFgMbKUItxaXNaStouvocbRXvp+CXw18P2sK+KfE0sc8wwHmu47dWYddike/qe1c38QvgePDukTeIfDOozXlpbp5k0MwDSKnd1ZQAwA5PA4yc11YzgDOsFh5YiUYy5FeUYyTlFb6r07XMcPxVluJqxpRk1zOybTSb8n/nY8mor1r4e/BrStZ8Or4s8YarLZ2cqmWNI5FjCxAnLyOwIAOM8dsHPPG+Pgt8NPElvOPCPiqSS4hUZMN3HcIhOcF1Azg4PcdKWE4BzjGYeFeCinNc0YuSUpLe6Xp3YYjinLsPVlSk5Pldm1FuKfmzwairWsabdaJqt3o96F8+ymeCTacglTjI9qp7vavj6lKVKbpzVmnZrs0fRQlGpFTjqnqJkete1/szf8ffiP/rnZ4/OavC/NFdr8KviIngDX3u7uCSawvI/KuUiA3jByrjPUg54yOCa+o4PxtHK88w+LxLtCLd325ouN/RX1PJ4iwVbHZXWoUFeTSsu9mn+g34pXV3dfEHXHvJGZ47tok3HpGvCAe2MV7frDyaj8C4p9XYtK2lWspZ25ZhsKsSe5IU/jWdqrfATxvqK+JdR1yw+0YXzBJdNbmULwN6NgnsOnTiuY+MvxY8O6roSeDPCMiT2zlPtM0cZWJUQgpGmcZ5VTkDAAAGc8foFPD0OHo5nj8RiqdSNeMlCMZczk5N2uvK9na9tT5CU62cSwWEo0JwdJxcnKNlHltez+Xl0Ot/aGP/FBWf8A2EYv/RclYn7M3+q8Rf71r/KSrml/Ev4cfEXwlF4e8c3aWNyqIJhOxjUyKP8AWRyDgfQ46kYI62LXxp8IvhRol1b+F9Rj1G5mO/ZBJ50k7gYUPIPlVR+mTgEnn1pSwWI4gpcTRxVNUIw1Tl7yfLJW5d767b9LHAoYqjlNTI3Qm6zlpaPu25k737aenmeZP4M1bxx8T9c0nTE2qNUunuJ2HyQR+c2WPqewHc/iR6l4y8V6F8G/DMPhXwrFGdTkjzGGwxTPBnl9WODge3TAxTPhh4+8A6X4YS61XXtOtNX1Kaa71Dc2HaVpGOT+GMDtVTUrD9n3WL+fU9T8QwXF1cuXlkfUJiWP5/gB2HFcGX5fSwGXzxWV4iksViNXKc0nTjLXlitXza67a+iOrF4qpisZGhjqNR0KOijGLanJaXe2nby9WVP2cbu5vr7xPeXk7zTzG2kkkdsszEy5JNegeCgEtPEzrwx1y+JI9cj/AAri/BHiD4WeDPE+tw6Nr9nb6ZcWtmYmadnDygzbwC2TwCn51oeE/iN4HsrXxAl34msYmudXvJ4Qz/fjYjaw9jXs8N4jDZbgsJhsRiIOcHWTammruUtbu2/R9Tzs6oV8bia9ejRmoyVOy5X/ACrS3l17HjfwumlX4i6HIsjB2vAC2eSCCD+YJr6K1S3tm+J2hzuq+aul3uw9zh4R/Jm/M18v+BdasdD8ZaRq2ouyW1tdo8rhc7VzgnHfGc16v8TfirpFn4t8MeJPCup2+pCwW4W5jibqj7AUPHBIzj0Iz2r4/g3NcJlmSVZYmavGtTla+tuaF2lu7Wb07H0fEmW4nG5pTjRi9ac1e2l7Ssm9lfz7nMfHq6uZviHcQzs3l29vCkIJ4Cldxx/wJmr1H4cXNzf/AATf7c7ShbO9hQsc5jXeqj6AcfQVn61qfwM+I6W+va5rFvBcxRBSslwbefb12MufmwSemepwa63TtS0HUvhxe3Hhi3MOkxWd1Ba5UqGSNWXcAecEg8nk9TzX0+TZUqWeY3M4YmFSFaE3GMZXk02ndroo7fNHhZljXPLMNgpUJQlTlFNuNkmk1o+re55l4U+Enh238IxeLfiDrtxb2k0KTrDHJ5cccbfdDHBLFsrgDHJxzXcfCy9+Gr3Oo2Hw/spkMSI1zPIr/vBkhQC53evYCuc8NeO/h3458AW3g/xhqkenTQQRW8qyy+TuMeNkiOfl52g4PfIwR1t6f4s+Dvwo0e6HhrVI9RupwGZYJfOlnYfdVnA2qBk+mMngmpyeOWZXPDYvByoRw8YXnOTvW5rO6V9Vra6XmktkVmKx+OjWw2JVV1nK0YpWp8t1Zvv6+j7s8e+JZ/4r/X+f+X6T+dc1ketP1jWLjW9VvNYvNvn3s7zybRwGZiSB7c1T80V+IZhUWKxdWvDaUpNejbZ+oYShKhh6dKW8Ypfckir5gq7o62E+pQJqk6w2ikvMxJGVUZKjAJycbRgHk1j+Z70eZ71tTioTUmr26PZnozpOcXFaXOsjTwnaSaoJ5Wu4BIgsmUt5hjZXbOMqNw/dg7hgHPFU76TQl0WyS1Q/2iRundS2MbpAQ2TjOBHjAHG7Pauf8z3o8z3rolWUouKpxWjW3d3/AA2XkYRwbTUnNvbr2Vvx3fmdJbR6O+gPLciJbkGQiQT/AL3cNuxPLzypy2Tjj14wZrtPD6zaSgREgliUXUscgZgzRrucgSMflYscFUzjGD25XzPejzPemq0VG3s106dn+vXr5h9UlzX531/H/Lp+R1dvHoS3d/D5UFwtvGscTNNhJHVcPIpMkfBYZA5IDD5T2g+x6MU0KeW8WO3uFVdSdJQ0sTfaJAxEfLDEQQ9Mfia5vzPejzPej2sGtaa6/mn+lt9n0D6pPpN/0rf8H1OvWPw7Fq0f22G1jiFrK8kMVy00XmBW8v51bJJ+XKhuvpkqF09fBE0kjXUl7EjXswt1Z1z5G1dgkx0OWJ3D+4w7gjj/ADPejzPerWJjF/wovW+q9O1u3pq9CHgJNfHLa2//AA/c6d00UaLpbpHD9olk/wBLk80blHmuMbfMyBsCH/Vj/e7VY2eEoNe07ymW5025fFws0jqYFMhGGZccqvII4IwSOSByHme9Hme9SsRGNrU46cvTtb8+t73G8FJ3vN6369/8uh7L8LtD+EOp6Ld6r471GzgununENpJfNF5UQAI2gMGbJJGST90e+ej+I3xt8J23haXwf4A/fCe3Np50cRjht4SNrKoYAsSvAwMDOc5GK+d/M96PM969/D8U4jA4B4LBUYU3KPLKaj78l6/P5dLHj1uF6OKxixeKqTmk7xg37q+X9X63LfmCjzBVTzPejzPevk/Zn0fIW/MFHmCqnme9Hme9Hsw5CvketGR602iumx02HZHrRketNoosFh2R60ZHrTaKLBYdketGR602iiwWHZHrRketNoosFh2R60ZHrTaKLBYdketGR602iiwWHZHrRketNoosFh2R60ZHrTaKLBYTcKNwp97byWV5PZyAhoJWiYHqCpI/pUGTWjg4uzBNSV0SbhRuFR5NGTS5Rkm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coHo/x48D3XhHx1eXqW7DTtYla8tpeSu9jmRM9AQxJx/dK15xX334m8MaF4v0mXRfEOnpd2kpB2sSCrDoysOVI9QfX1r5J+L/w50LwJqLQaNcXroWyBcSK20HsMKPWv0DjThd5ViJYyjJezm27dU+q2tbtr5dLv4bg3iZZph44StF+0gkr9Guj3vfv9/Wx51RTKK+CPvLD6KZRQFh9FMooCw+imUUBYfRTKKAsPoplFAWH0UylUbmVT3IFArDq9/wDhD8DLLxH4Ni13xHE0Ut7M8lspXkwYUKTn1IYj1BB71L8GPgx4K1y3TX9aiur14SCttLIPIJzkEqFBPToTg9wa+ikRIkWONFRFAVVUYAA6ACv1TgnhGniU8fjbSg1ZR137v9D8u404sqYZrA4K8Zp3cvLsvXqf/9k=",
         "name": {
           "last": "",
           "first": "Buzinga"
         },
         "isOwn": false,
         "type": "Company",
         "fullName": "Buzinga ",
         "id": "55b92ad521e4b7c40f00061d"
       }
     }
     */

    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {post} /companies/ Request for creating new company
     *
     * @apiVersion 0.0.1
     * @apiName CreateNewCompany
     * @apiGroup Customers
     *
     * @apiParamExample {json} Request-Example:
     {
       "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       "isOwn": false,
       "type": "Company",
       "email": "",
       "name": {
         "first": "NewCompany",
         "last": ""
       },
       "address": {
         "street": "",
         "city": "",
         "state": "",
         "zip": "",
         "country": ""
       },
       "website": "",
       "contacts": [

       ],
       "phones": {
         "phone": "",
         "mobile": "",
         "fax": ""
       },
       "internalNotes": "",
       "salesPurchases": {
         "isCustomer": false,
         "isSupplier": false,
         "active": false,
         "salesPerson": null,
         "salesTeam": null,
         "implementedBy": null,
         "reference": "",
         "language": "English"
       },
       "social": {
         "LI": "",
         "FB": ""
       },
       "history": [

       ],
       "attachments": [

       ],
       "notes": [

       ],
       "groups": {
         "owner": null,
         "users": [

         ],
         "group": [

         ]
       },
       "whoCanRW": "everyOne"
     }
     * @apiSuccess {Object} NewCompany Just created new company
     * @apiSuccessExample Success-Response:
     HTTP/1.1 201 Created
     {
         "success":"A new Person crate success",
         "id":"577fc8695651db3a56865d9c"
     }
     */
    router.post('/', accessStackMiddleware, handler.create);
    router.put('/:id', accessStackMiddleware, handler.update);

    /**
     *@api {patch} /companies/:id Request for updating only selected fields on choosen Company
     *
     * @apiVersion 0.0.1
     * @apiName UpdateCompany
     * @apiGroup Customers
     *
     * @apiParam {String} id Unique id of Company
     * @apiParamExample {json} Request-Example:
     {
           "address": {
             "country": "Australia",
             "zip": "31212",
             "state": "Melbourne",
             "city": "Richmond",
             "street": "Level 1, 225 - 227 Swan St"
           }
     }
     * @apiSuccess {Object} PartlyUpdatedCompany Just updated choosen fields in Company
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "success": "Customer updated",
           "notes": [
             {
               "_id": "1467293402830",
               "title": "",
               "note": "sadasdsad",
               "date": "2016-06-30T13:30:03.008Z"
             }
           ]
     }
     */
    router.patch('/:id', accessStackMiddleware, handler.udateOnlySelectedFields);

    /**
     *@api {delete} /companies/:id Request for deleting the Company
     *
     * @apiVersion 0.0.1
     * @apiName deleteCompany
     * @apiGroup Customers
     *
     * @apiParam {String} id Unique id of Company
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": "customer removed"
     }
     */
    router.delete('/:id', accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /companies/ Request for deleting a few Companies
     *
     * @apiVersion 0.0.1
     * @apiName deleteFewCompanies
     * @apiGroup Customers
     *
     * @apiParamExample {json} Request-Example:
     {
         "contentType": "Companies",
         "ids": [
             "577fc8695651db3a56865d9c",
             "577fc84b5651db3a56865d9b"
         ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":2
     }
     */
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
