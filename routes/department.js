
var express = require('express');
var router = express.Router();
var DepartmentHandler = require('../handlers/department');
var MODULES = require('../constants/modules');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    'use strict';
    var moduleId = MODULES.DEPARTMENTS;

    var handler = new DepartmentHandler(models);
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, handler.get);
    router.get('/getForDD', authStackMiddleware, handler.getForDD);
    router.get('/exportToXlsx',authStackMiddleware, accessStackMiddlware, handler.exportToXlsx);
    router.get('/exportToCsv',authStackMiddleware, accessStackMiddlware, handler.exportToCsv);
    router.get('/getDepartmentsForEditDd', authStackMiddleware, handler.getDepartmentsForEditDd);
    router.get('/form',authStackMiddleware, accessStackMiddlware, handler.getById);
    router.get('/:viewType',authStackMiddleware, accessStackMiddlware, handler.getCustomDepartment);

    router.post('/',authStackMiddleware, accessStackMiddlware, handler.create);
    router.put('/:id',authStackMiddleware, accessStackMiddlware, handler.update);
    router.delete('/:id',authStackMiddleware, accessStackMiddlware, handler.remove);
    return router;
};