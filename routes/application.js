var express = require('express');
var router = express.Router();
var EmployeeHandler = require('../handlers/employee');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new EmployeeHandler(event, models);
    var moduleId = MODULES.APPLICATIONS;
    var accessStackMiddlWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlWare, handler.getByViewTpe);

    router.get('/getApplicationsLengthByWorkflows', handler.getCollectionLengthByWorkflows);
    router.get('/totalCollectionLength', accessStackMiddlWare, handler.totalCollectionLength);

    router.get('/:id', accessStackMiddlWare, handler.getByViewTpe);

    router.post('/', accessStackMiddlWare, handler.create);
    router.patch('/:id', accessStackMiddlWare, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddlWare, handler.remove);

    return router;
};
