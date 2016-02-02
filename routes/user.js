var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');

module.exports = function (event, models) {
    'use strict';
    var handler = new UserHandler(event, models);

    router.post('/login', handler.login);
    router.patch('/:id', handler.putchModel);

    return router;
};