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

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlware, handler.getByViewTpe);
    router.get('/getForProjectDetails', accessStackMiddlware, handler.getForProjectDetails);
    router.get('/getForDD', accessStackMiddlware, handler.getForDD);
    router.get('/bySales', accessStackMiddlware, handler.getBySales);
    router.get('/byDepartment', accessStackMiddlware, handler.byDepartment);
    router.get('/exportToXlsx', accessStackMiddlware, handler.exportToXlsx);
    // router.get('/exportToCsv', accessStackMiddlware, handler.exportToCsv);
    // router.get('/getMinHireDate', accessStackMiddlware, handler.getMinHireDate);
    router.get('/getForDdByRelatedUser', accessStackMiddlware, handler.getForDdByRelatedUser);
    router.get('/getPersonsForDd', accessStackMiddlware, handler.getSalesPerson);
    router.get('/getEmployeesAlphabet', accessStackMiddlware, handler.getEmployeesAlphabet);
    router.get('/getEmployeesImages', accessStackMiddlware, handler.getEmployeesImages);
    router.get('/totalCollectionLength', accessStackMiddlware, handler.totalCollectionLength);
    router.get('/nationality', accessStackMiddlware, handler.getNationality);
    router.get('/languages', accessStackMiddlware, handler.getLanguages);
    router.get('/sources', accessStackMiddlware, handler.getSources);
    /*router.get('/getByMonth', accessStackMiddlware, handler.getSalaryByMonth);*/

    router.get('/birthdays', accessStackMiddlware, handler.getBirthdays);
    router.get('/getYears', handler.getYears);
    router.get('/getEmployeesCount', handler.getEmployeesCount);

    router.post('/', accessStackMiddlware, handler.create);
    router.post('/uploadEmployeesFiles', accessStackMiddlware, multipartMiddleware, handler.uploadEmployeesFiles);
    router.patch('/:id', accessStackMiddlware, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddlware, handler.remove);

    return router;
};