var express = require('express');
var router = express.Router();
var Handler = require('../handlers/followers');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';
    var handler = new Handler(models);
    var moduleId = MODULES.FOLLOWERS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    
    // router.get('/', handler.getForView);
    router.post('/', /*accessStackMiddleware,*/ handler.create);
    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.remove);

    return router;
};
