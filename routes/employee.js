var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var moduleId = MODULES.EMPLOYEES;
    var handler = new EmployeeHandler(event, models);
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    router.get('/list', authStackMiddleware, accessStackMiddlware, handler.getFilter);
    router.get('/thumbnails', authStackMiddleware, accessStackMiddlware, handler.getFilter);
    router.get('/form', authStackMiddleware, accessStackMiddlware, handler.getById);
    router.get('/getForProjectDetails', authStackMiddleware, handler.getForProjectDetails);
    router.get('/getForDD', authStackMiddleware, handler.getForDD);
    router.get('/bySales', authStackMiddleware, handler.getBySales);
    router.get('/byDepartment', authStackMiddleware, handler.byDepartment);
    router.get('/exportToXlsx', authStackMiddleware, handler.exportToXlsx);
    router.get('/exportToCsv', authStackMiddleware, handler.exportToCsv);
    router.get('/getMinHireDate', authStackMiddleware, handler.getMinHireDate);
    router.get('/getForDdByRelatedUser', authStackMiddleware, handler.getForDdByRelatedUser);
    router.get('/getPersonsForDd', authStackMiddleware, handler.getSalesPerson);
    router.get('/getEmployeesAlphabet', authStackMiddleware, handler.getEmployeesAlphabet);
    router.get('/getEmployeesImages', authStackMiddleware, handler.getEmployeesImages);
    router.get('/totalCollectionLength', authStackMiddleware, handler.totalCollectionLength);
    router.get('/nationality', authStackMiddleware, handler.getNationality);
    router.get('/languages', authStackMiddleware, handler.getLanguages);
    router.get('/sources', authStackMiddleware, handler.getSources);
    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.post('/uploadEmployeesFiles', authStackMiddleware, accessStackMiddlware, multipartMiddleware, handler.uploadEmployeesFiles);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.updateOnlySelectedFields);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);

    return router;
};