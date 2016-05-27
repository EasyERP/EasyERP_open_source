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
    router.use(authStackMiddleware);

    router.get('/getApplicationsLengthByWorkflows',  handler.getCollectionLengthByWorkflows);
    router.get('/totalCollectionLength', accessStackMiddlware, handler.totalCollectionLength);

    router.get('/:id', accessStackMiddlware, handler.getByViewTpe);

    router.post('/', accessStackMiddlware, handler.create);
    router.patch('/:id', accessStackMiddlware, handler.updateOnlySelectedFields);
    router.delete('/:id', accessStackMiddlware, handler.remove);

    return router;
};