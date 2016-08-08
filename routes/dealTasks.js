var express = require('express');
var router = express.Router();
var TasksHandler = require('../handlers/dealTasks');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';
    var moduleId = MODULES.DEALTASKS;
    var handler = new TasksHandler(models, event);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

  
    router.get('/priority', handler.getTasksPriority);
    router.get('/getActivity', handler.getActivity);
    router.get('/getLengthByWorkflows', handler.getLengthByWorkflows);
    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/:id', handler.getById);
    router.get('/', handler.getTasks);

    router.post('/', handler.createTask);
    router.post('/uploadFiles', handler.uploadFile);
    router.patch('/:_id', handler.taskUpdateOnlySelectedFields);
    
    router.delete('/:_id', handler.removeTask);
    router.delete('/', handler.bulkRemove);

    return router;
};
