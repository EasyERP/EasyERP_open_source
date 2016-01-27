
var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');

module.exports = function (event, models) {
    var handler = new EmployeeHandler(event, models);

    router.get('/list', handler.getFilter);
    router.get('/thumbnails', handler.getFilter);
    router.get('/form', handler.getById);
    router.get('/getForProjectDetails', handler.getForProjectDetails);
    router.get('/getForDD', handler.getForDD);
    router.get('/bySales', handler.getBySales);
    router.get('/byDepartment', handler.byDepartment);
    router.get('/exportToXlsx',handler.exportToXlsx);
    router.get('/exportToCsv',handler.exportToCsv);
    router.get('/getYears',handler.getYears);


    router.post('/',handler.create);

    router.patch('/:id',handler.updateOnlySelectedFields);

    router.delete('/:id',handler.remove);



    return router;
};