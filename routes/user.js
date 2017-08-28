var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models, mainDb) {
    'use strict';
    var moduleId = MODULES.USERS;
    var handler = new UserHandler(event, models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    /**
     *@api {get} /users/ Request Users
     *
     * @apiVersion 0.0.1
     * @apiName getUsers
     * @apiGroup User
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Users which will show
     * @apiParam (?Field=value) {String} contentType="Users" Type of content
     *
     * @apiSuccess {Object} Users
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "total": 81,
      "data": [
        {
          "_id": "560c099da5d4a2e20ba5068b",
          "total": 81,
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

              ],
              "countPerPage": 10
            }
          },
          "credentials": {
            "access_token": "",
            "refresh_token": ""
          },
          "email": "alex.svatuk@thinkmobiles.com",
          "login": "AlexSvatuk",
          "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
          "lastAccess": "2016-06-13T07:19:42.578Z",
          "savedFilters": [

          ],
          "profile": {
            "_id": 1387275504000,
            "__v": 0,
            "attachments": [

            ],
            "profileAccess": [
              {
                "_id": "52b024f07fa64ad41e000002",
                "module": 1,
                "access": {
                  "del": false,
                  "editWrite": false,
                  "read": false
                }
              },
              {
                "_id": "52b024f07fa64ad41e000004",
                "module": 6,
                "access": {
                  "del": false,
                  "editWrite": false,
                  "read": false
                }
              },
              ...
            ],
            "profileDescription": "No description",
            "profileName": "banned"
          }
        },
        ...
      ]
}
                 */
    router.get('/verify', handler.verify);
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getAll);

    /**
     *@api {get} /users/profiles/:id Request Users by ProfileId
     *
     * @apiVersion 0.0.1
     * @apiName getUsersByProfileId
     * @apiGroup User
     *
     * @apiParam {Number} profileId
     *
     * @apiSuccess {Object} UsersByProfileId
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "count": 42,
         "data": [
             "admin",
             "Irina.Grab",
             "peter.volosh",
             "vasiliy.almashi",
             "ivan.bilak",
             "MariaZasukhina",
             "yana.gusti",
             "yevgenia.bezyk",
             "Vitaliy.Shuba",
             "natalia.yartysh",
             "kristian.rimar",
             "liliya.shustur",
             "olga.sikora",
             "michael",
             "gabriella.shterr",
             "alex.sokhanych",
             "oles.pavliuk",
             "roman.kubichka",
             "stanislav.romanyuk",
             "dmytro.babilia",
             "andriy.hanchak",
             "anatoliy.dalekorey",
             "sergey.melnik",
             "anastas.lyakh",
             "eugen.lendyel",
             "sergiy.ihnatko",
             "anton.nizhegorodov",
             "roman.babunych",
             "yana.vengerova",
             "anton.gychka@thinkmobiles.com",
             "victor.mangur",
             "volodymyr.trytko",
             "dima.lylyk",
             "roman.siladii",
             "eugen.bernikevych",
             "alex.vinog",
             "artem.petrov",
             "alex.ryabcev",
             "tetiana.bysaha",
             "viktoria.lutak",
             "roman.buchuk",
             "ivan.khartov"
         ],
         "isOwnProfile": true
     }
     *
     */
    router.get('/profiles/:id', authStackMiddleware, accessStackMiddleware, handler.getByProfile);

    /**
     *@api {get} /users/forDD Request UsersForDD
     *
     * @apiVersion 0.0.1
     * @apiName getUsersForDD
     * @apiGroup User
     *
     * @apiSuccess {Object} UsersForDD
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "data": [
             {
               "_id": "560c099da5d4a2e20ba5068b",
               "login": "AlexSvatuk"
             },
             {
               "_id": "55ba28c8d79a3a3439000016",
               "login": "AndrianaLemko"
             },
             ...
           ]
     }
     */
    router.get('/forDd', authStackMiddleware, handler.getForDd);

    /**
     *@api {get} /users/current/ Request currentUser
     *
     * @apiVersion 0.0.1
     * @apiName getCurrentUser
     * @apiGroup User
     *
     * @apiSuccess {Object} CurrentUser
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "user": {
             "_id": "52203e707d4dba8813000003",
             "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
             "login": "admin",
             "email": "info@thinkmobiles.com",
             "kanbanSettings": {
               "applications": {
                 "countPerPage": 10,
                 "foldWorkflows": [
                   "Empty"
                 ]
               },
               "opportunities": {
                 "countPerPage": 10,
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
             "lastAccess": "2016-07-15T09:00:43.576Z",
             "credentials": {
               "access_token": "",
               "refresh_token": ""
             },
             "profile": {
               "_id": 1387275598000
             },
             "relatedEmployee": {
               "_id": "55b92ad221e4b7c40f00004f",
               "name": {
                 "last": "Sokhanych",
                 "first": "Alex"
               },
               "imageSrc": "data:image/jpeg;base64,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"
             }
           },
           "savedFilters": {
             "undefined": [
               {
                 "filter": [
                   {
                     "_id": "574335bb27725f815747d579",
                     "filters": {
                       "In pr": {
                         "workflow": {
                           "type": null,
                           "value": [
                             "528ce74ef3f67bc40b00001e",
                             "528ce779f3f67bc40b00001f"
                           ],
                           "key": "workflow._id"
                         }
                       }
                     },
                     "byDefault": "Leads"
                   }
                 ]
               }
             ]
           }
     }
     */
    router.get('/current', authStackMiddleware, handler.getById);

    /**
     *@api {get} /users/totalCollectionLength/ Request totalCollectionLength
     *
     * @apiVersion 0.0.1
     * @apiName getTotalCollectionLength
     * @apiGroup User
     *
     * @apiSuccess {Object} totalCollectionLength
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "count": 82
     }
     */
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddleware, handler.totalCollectionLength);

    /**
     *@api {get} /users/:id Request User
     *
     * @apiVersion 0.0.1
     * @apiName getUser
     * @apiGroup User
     *
     * @apiParam {String} id Unique id of User
     *
     * @apiSuccess {Object} User
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "user": {
             "_id": "5788f53c47f56a8e213510ba",
             "imageSrc": "",
             "login": "Ivan",
             "email": "ivan@gmail.com",
             "kanbanSettings": {
                 "tasks": {
                     "foldWorkflows": [],
                     "countPerPage": 10
                 },
                 "applications": {
                     "foldWorkflows": [],
                     "countPerPage": 10
                 },
                 "opportunities": {
                     "foldWorkflows": [],
                     "countPerPage": 10
                 }
             },
             "lastAccess": null,
             "credentials": {
                 "access_token": "",
                 "refresh_token": ""
             },
             "profile": {
                 "_id": 1438325949000
             },
             "relatedEmployee": null
         },
         "savedFilters": {
             "undefined": [
                 {
                     "filter": [
                         {}
                     ]
                 }
             ]
         }
     }
     */
    router.get('/:id', authStackMiddleware, handler.getById);

    /**
     *@api {post} /users/ Request for creating new User
     *
     * @apiVersion 0.0.1
     * @apiName createUser
     * @apiGroup User
     *
     * @apiParamExample {json} Request-Example:
     {
         "imageSrc": "",
         "login": "Ivan",
         "email": "ivan@gmail.com",
         "profile": "1438325949000",
         "relatedEmployee": null,
         "savedFilters": [

         ],
         "pass": "123321"
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": "A new User crate success",
         "id": "5788f53c47f56a8e213510ba"
     }
     *
     */

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/login/social', handler.loginSocial);
    router.post('/signUp', handler.createWithVerify);
    router.post('/login', handler.login);
    router.post('/forgotPassword', handler.forgotPassword);
    router.post('/current', authStackMiddleware, accessStackMiddleware, handler.putchModel);

    /**
     *@api {patch} /users/:id Request for partly updating User
     *
     * @apiVersion 0.0.1
     * @apiName updateUser
     * @apiGroup User
     *
     * @apiParam {String} id Unique id of User
     * @apiParamExample {json} Request-Example:
     {
         "login": "Svatuk"
     }
     *
     * @apiSuccess {Object} UpdatedUser
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "success": {
             "_id": "560c099da5d4a2e20ba5068b",
             "profile": 1387275504000,
             "__v": 0,
             "lastAccess": "2016-06-13T07:19:42.578Z",
             "relatedEmployee": null,
             "savedFilters": [

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

                 ],
                 "countPerPage": 10
               }
             },
             "credentials": {
               "access_token": "",
               "refresh_token": ""
             },
             "pass": "0bf84b7619214e1d2ae629a560c9c2f6ba469cbb6b1e08fef80e424b68879a89",
             "email": "alex.svatuk@thinkmobiles.com",
             "login": "Svatuk",
             "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
           }
     }
     *
     */
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.putchModel);
    router.patch('/current/:id', authStackMiddleware, /* accessStackMiddleware,*/ handler.putchModel); // commented for change Pass


    /**
     *@api {delete} /users/:id Request for deleting User
     *
     * @apiVersion 0.0.1
     * @apiName deleteUser
     * @apiGroup User
     *
     * @apiParam {String} id Unique id of User
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success":"User remove success"
     }
     *
     */
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    /**
     *@api {delete} /users/ Request for deleting selected Users
     *
     * @apiVersion 0.0.1
     * @apiName deleteUsers
     * @apiGroup User
     *
     * @apiParamExample {json} Request-Example:
     {
         "contentType": "Users",
         "ids": [
             "55ba28c8d79a3a3439000016",
             "55ba2ef1d79a3a343900001c"
         ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": true
     }
     *
     */
    router.delete('/', authStackMiddleware, accessStackMiddleware, handler.bulkRemove);

    return router;
};
