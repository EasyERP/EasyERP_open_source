var express = require('express');
var router = express.Router();
var ProfilesHandler = require('../handlers/profiles');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';
    var moduleId = MODULES.PROFILES;
    var handler = new ProfilesHandler(models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getProfile);
    router.get('/forDd', authStackMiddleware, accessStackMiddleware, handler.getProfileForDd); // added middleware by Liliya

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.createProfile);
    router.put('/:_id', authStackMiddleware, accessStackMiddleware, handler.updateProfile);
    router.delete('/:_id', authStackMiddleware, accessStackMiddleware, handler.removeProfile);

    return router;
};
