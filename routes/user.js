var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var moduleId = MODULES.USERS;
    var handler = new UserHandler(event, models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getAll);
    router.get('/profiles/:id', authStackMiddleware, accessStackMiddleware, handler.getByProfile);
    router.get('/forDd', authStackMiddleware, handler.getForDd);
    router.get('/current', authStackMiddleware, handler.getById);
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddleware, handler.totalCollectionLength);
    router.get('/:id', authStackMiddleware, handler.getById);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/login', handler.login);
    router.post('/current', authStackMiddleware, accessStackMiddleware, handler.putchModel);

    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.putchModel);
    router.patch('/current/:id', authStackMiddleware, accessStackMiddleware, handler.putchModel);
    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);

    return router;
};
