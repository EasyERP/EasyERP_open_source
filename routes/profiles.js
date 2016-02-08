var express = require('express');
var router = express.Router();
var ProfilesHandler = require('../handlers/profiles');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';
    var moduleId = MODULES.PROFILES;
    var handler = new ProfilesHandler(models);
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddlware, handler.getProfile);
    router.get('/forDd', authStackMiddleware, accessStackMiddlware, handler.getProfileForDd); // added middleware by Liliya

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.createProfile);
    router.put('/:_id', authStackMiddleware, accessStackMiddlware, handler.updateProfile);
    router.delete('/:_id', authStackMiddleware, accessStackMiddlware, handler.removeProfile);

    return router;
};