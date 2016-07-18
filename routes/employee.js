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

    router.get('/', accessStackMiddleware, handler.getByViewTpe);
    router.get('/getForProjectDetails', accessStackMiddleware, handler.getForProjectDetails);
    router.get('/getForDD', handler.getForDD);
    router.get('/bySales', accessStackMiddleware, handler.getBySales);
    router.get('/byDepartment', accessStackMiddleware, handler.byDepartment);
    router.get('/exportToXlsx', accessStackMiddleware, handler.exportToXlsx);
    // router.get('/exportToCsv', accessStackMiddleware, handler.exportToCsv);
    router.get('/getForDdByRelatedUser', accessStackMiddleware, handler.getForDdByRelatedUser);
    router.get('/getPersonsForDd', accessStackMiddleware, handler.getSalesPerson);
    router.get('/getEmployeesAlphabet', accessStackMiddleware, handler.getEmployeesAlphabet);
    router.get('/getEmployeesImages', accessStackMiddleware, handler.getEmployeesImages);
    router.get('/nationality', accessStackMiddleware, handler.getNationality);
    router.get('/languages', accessStackMiddleware, handler.getLanguages);
    router.get('/sources', handler.getSources);
    /* router.get('/getByMonth', accessStackMiddleware, handler.getSalaryByMonth);*/

    router.get('/birthdays', accessStackMiddleware, handler.getBirthdays);
    router.get('/getYears', handler.getYears);
    router.get('/getEmployeesCount', handler.getEmployeesCount);
    router.get('/getEmployeesCountForDashboard', handler.getEmployeesCountForDashboard);
    router.get('/EmployeesForChart', handler.getEmployeesForChart);
    router.get('/byDepartmentForChart', handler.byDepartmentForChart);
    router.get('/getSalaryForChart', handler.getSalaryForChart);
    router.get('/getSalaryByDepartment', handler.getSalaryForChartByDepartment);

    router.post('/', accessStackMiddleware, handler.create);
    router.post('/transfer/', accessStackMiddleware, handler.createTransfer);
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);
    router.patch('/transfer/', accessStackMiddleware, handler.updateTransfer);
    router.patch('/:id', accessStackMiddleware, handler.updateOnlySelectedFields);

    router.delete('/transfer/', accessStackMiddleware, handler.removeTransfer);
    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
