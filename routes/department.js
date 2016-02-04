
var express = require('express');
var router = express.Router();
var DepartmentHandler = require('../handlers/department');

module.exports = function (models) {
    'use strict';
    var handler = new DepartmentHandler(models);

    router.get('/getForDD', handler.getForDD);
    router.get('/exportToXlsx', handler.exportToXlsx);
    router.get('/exportToCsv',handler.exportToCsv);
    router.get('/getDepartmentsForEditDd',handler.getDepartmentsForEditDd);
    router.get('/form',handler.getById);
    router.get('/:viewType',handler.getCustomDepartment);

    router.post('/',handler.create);
    router.put('/:id',handler.update);
    router.delete('/:id',handler.remove);
    return router;
};