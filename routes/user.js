var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var moduleId = MODULES.USERS;
    var handler = new UserHandler(event, models);
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddlware, handler.getAll);
    router.get('/profiles/:id', authStackMiddleware, accessStackMiddlware, handler.getByProfile);
    router.get('/forDd', authStackMiddleware, handler.getForDd);
    router.get('/:viewType', authStackMiddleware, handler.getUsers);

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.post('/login', handler.login);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.putchModel);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);

    return router;
};