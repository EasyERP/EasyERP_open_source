var express = require('express');
var router = express.Router();
var VocationHandler = require('../handlers/vacation');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new VocationHandler(event, models);
    var moduleId = MODULES.VACATION;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getForView);
    router.get('/getYears', authStackMiddleware, accessStackMiddleware, handler.getYears);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.patch('/', authStackMiddleware, accessStackMiddleware, handler.putchBulk);

    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
