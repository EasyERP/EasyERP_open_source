var express = require('express');
var router = express.Router();
var DepartmentHandler = require('../handlers/department');
var MODULES = require('../constants/modules');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models, event) {
    'use strict';
    var moduleId = MODULES.DEPARTMENTS;

    var handler = new DepartmentHandler(models, event);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    /**
     *@api {get} /departments/ Request Departments
     *
     * @apiVersion 0.0.1
     * @apiName getDepartments
     * @apiGroup Departments
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of departments which will show
     * @apiParam (?Field=value) {String} contentType="Departments" Type of content
     *
     * @apiSuccess {Object} Departments
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 304 Not Modified
     {
     "data": [
         {
             "_id": "56cebdf6541812c07197358f",
             "__v": 0,
             "sequence": 9,
             "nestingLevel": 0,
             "editedBy": {
                 "date": "2016-02-25T08:40:29.051Z",
                 "user": "563f673270bbc2b740ce89ae"
             },
             "createdBy": {
                 "date": "2016-02-25T08:40:22.784Z",
                 "user": "563f673270bbc2b740ce89ae"
             },
             "users": [],
             "departmentManager": null,
             "parentDepartment": null,
             "name": "Development"
         },
         {
             "_id": "56e6775c5ec71b00429745a4",
             "__v": 0,
             "isDevelopment": false,
             "sequence": 1,
             "nestingLevel": 0,
             "editedBy": {
                 "date": "2016-05-06T13:59:56.345Z",
                 "user": "563f673270bbc2b740ce89ae"
             },
             "createdBy": {
                 "date": "2016-03-14T08:33:32.754Z",
                 "user": "52203e707d4dba8813000003"
             },
             "users": [],
             "departmentManager": null,
             "parentDepartment": null,
             "name": "Service"
         },
         ...
     ]
 }
     * */
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getByViewType);

    /**
     *@api {get} /departments/getForDD Request Departments for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getDepartmentsForDropDown
     * @apiGroup Departments
     *
     * @apiSuccess {Object} DepartmentsForDropDown
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 304 Not Modified
     {
  "data": [
    {
      "_id": "55b92ace21e4b7c40f000012",
      "departmentManager": null,
      "name": ".NET/WP"
    },
    {
      "_id": "55b92ace21e4b7c40f000010",
      "departmentManager": null,
      "name": "Android"
    },
    {
      "_id": "55b92ace21e4b7c40f000014",
      "departmentManager": null,
      "name": "BusinessDev"
    },
    ...
  ]
}
     * */
    router.get('/getForDD', authStackMiddleware, handler.getForDD);
    /* router.get('/exportToXlsx',authStackMiddleware, accessStackMiddleware, handler.exportToXlsx);
     router.get('/exportToCsv',authStackMiddleware, accessStackMiddleware, handler.exportToCsv); */
    router.get('/getDepartmentsForEditDd', authStackMiddleware, handler.getDepartmentsForEditDd);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.update);
    
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
