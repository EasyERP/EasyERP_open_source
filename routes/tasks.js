var express = require('express');
var router = express.Router();
var TasksHandler = require('../handlers/tasks');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');


module.exports = function (models, event) {
    'use strict';
    var moduleId = MODULES.TASKS;
    var handler = new TasksHandler(models, event);
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);
    
    router.use(authStackMiddleware);
    router.use(accessStackMiddlware);

    router.post('/', handler.createTask);
    router.get('/priority', handler.getTasksPriority);
    router.get('/getLengthByWorkflows', handler.getLengthByWorkflows);
    router.get('/:viewType', handler.getTasks);
    router.patch('/:_id', handler.taskUpdateOnlySelectedFields);
    router.delete('/:_id', handler.removeTask);

    return router;
};