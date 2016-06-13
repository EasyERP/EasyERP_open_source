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
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleWare, handler.getByViewTpe);
    router.get('/upload', handler.getCollectionLengthByWorkflows);

    router.post('/uploadApplicationFiles', accessStackMiddleWare, multipartMiddleware, handler.uploadFile);
    router.post('/', accessStackMiddleWare, handler.create);
    router.patch('/:id', accessStackMiddleWare, handler.updateOnlySelectedFields);

    router.delete('/:id', accessStackMiddleWare, handler.remove);
    router.delete('/', accessStackMiddleWare, handler.bulkRemove);

    return router;
};
