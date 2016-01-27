/**
 * Created by liliy on 27.01.2016.
 */
"use strict";
var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');

module.exports = function (event, models) {
    var handler = new EmployeeHandler(event, models);

    router.get('/list', handler.getFilter);
    router.get('/form', handler.getById);
    router.get('/kanban', handler.getApplicationsForKanban);

    router.post('/', handler.create);

    router.patch('/:id',handler.updateOnlySelectedFields);

    router.delete('/:id',handler.remove);

    return router;
};