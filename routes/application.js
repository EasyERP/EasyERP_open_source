var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new EmployeeHandler(event, models);
    var moduleId = MODULES.APPLICATIONS;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleWare, handler.getByViewTpe);
    router.get('/getApplicationsLengthByWorkflows', handler.getCollectionLengthByWorkflows);
    router.get('/totalCollectionLength', accessStackMiddleWare, handler.totalCollectionLength);

    router.post('/', accessStackMiddleWare, handler.create);
    router.patch('/:id', accessStackMiddleWare, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddleWare, handler.remove);

    return router;
};
