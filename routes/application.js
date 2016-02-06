/**
 * Created by liliy on 27.01.2016.
 */
"use strict";
var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    var handler = new EmployeeHandler(event, models);
    var moduleId = MODULES.APPLICATIONS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/list', authStackMiddleware, accessStackMiddlware, handler.getFilter);
    router.get('/form', authStackMiddleware, accessStackMiddlware, handler.getById);
    router.get('/kanban', authStackMiddleware, accessStackMiddlware, handler.getApplicationsForKanban);
    router.get('/getApplicationsLengthByWorkflows',  authStackMiddleware, handler.getCollectionLengthByWorkflows);
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddlware, handler.totalCollectionLength);
    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.updateOnlySelectedFields);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);

    return router;
};