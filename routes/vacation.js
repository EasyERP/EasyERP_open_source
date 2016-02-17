
var express = require('express');
var router = express.Router();
var VocationHandler = require('../handlers/vacation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new VocationHandler(event, models);
    var moduleId = MODULES.APPLICATIONS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/getYears', authStackMiddleware, accessStackMiddlware, handler.getYears);
    router.get('/:viewType', authStackMiddleware, accessStackMiddlware, handler.getForView);
    router.patch('/', authStackMiddleware, accessStackMiddlware, handler.putchBulk);
    //router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.putchModel); //not need
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);
    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);

    return router;
};