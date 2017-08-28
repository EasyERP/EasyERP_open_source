var express = require('express');
var router = express.Router();
var Handler = require('../handlers/language');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (event, models) {
    'use strict';

    var handler = new Handler(event, models);

    router.use(authStackMiddleware);

    /**
     *@api {get} /languages/ Request Employees languages
     *
     * @apiVersion 0.0.1
     * @apiName getEmployeesLanguages
     * @apiGroup Employee
     *
     * @apiSuccess {Object} EmployeesLanguages
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
             {
                 "_id": "5301e61b3d8b9898d5896e67",
                 "attachments": [],
                 "name": "English"
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
