var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var authStackMidlware = require('../helpers/checkAuth');

module.exports = function (event, models) {
    'use strict';
    var handler = new UserHandler(event, models);

    router.post('/', handler.create);
    router.post('/login', handler.login);
    router.patch('/:id', authStackMidlware, handler.putchModel);

    return router;
};