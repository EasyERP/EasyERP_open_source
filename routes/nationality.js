var express = require('express');
var router = express.Router();
var NationalityHandler = require('../handlers/nationality');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (event, models) {
    'use strict';

    var handler = new NationalityHandler(event, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /nationality/ Request Employees nationality
     *
     * @apiVersion 0.0.1
     * @apiName getEmployeesNationality
     * @apiGroup Employee
     *
     * @apiSuccess {Object} EmployeesNationality
     * @apiSuccessExample Success-Response:
     HTTP/1.1 304 Not Modified
     {
       "data": [
         {
           "_id": "British",
           "__v": 0
         },
         {
           "_id": "Canadian",
           "__v": 0
         },
         {
           "_id": "Czech",
           "__v": 0
         },
         {
           "_id": "Danish",
           "__v": 0
         },
         {
           "_id": "English",
           "__v": 0
         },
         {
           "_id": "Finnish",
           "__v": 0
         },
         {
           "_id": "Georgian",
           "__v": 0
         },
         {
           "_id": "German",
           "__v": 0
         },
         {
           "_id": "Romanian",
           "__v": 0
         },
         {
           "_id": "Serbian",
           "__v": 0
         },
         {
           "_id": "Turkish",
           "__v": 0
         },
         {
           "_id": "Ukrainian",
           "__v": 0
         }
       ]
     }
     */
    router.get('/', handler.get);

    router.post('/', handler.create);

    router.patch('/:id', handler.update);

    router.delete('/:id', handler.remove);

    return router;
};
