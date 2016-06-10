var express = require('express');
var router = express.Router();
var DepartmentHandler = require('../handlers/department');
var MODULES = require('../constants/modules');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    'use strict';
    var moduleId = MODULES.DEPARTMENTS;

    var handler = new DepartmentHandler(models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getByViewType);
    router.get('/getForDD', authStackMiddleware, handler.getForDD);
    /* router.get('/exportToXlsx',authStackMiddleware, accessStackMiddleware, handler.exportToXlsx);
     router.get('/exportToCsv',authStackMiddleware, accessStackMiddleware, handler.exportToCsv); */
    router.get('/getDepartmentsForEditDd', authStackMiddleware, handler.getDepartmentsForEditDd);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.put('/:id', authStackMiddleware, accessStackMiddleware, handler.update);
    
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
