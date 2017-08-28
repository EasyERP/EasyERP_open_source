'use strict';

var express = require('express');
var router = express.Router();
var Integrations = require('../handlers/channels.js');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var redisStore = require('../helpers/redisClient');

module.exports = function (models, event) {
    var integrations = new Integrations(models, event);
    var moduleId = MODULES.INTEGRATION;
    // var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    //router.get('/', integrations.getCredentials);
    router.get('/testConnection', integrations.testConnection);
    router.get('/auth_callback', integrations.approveIntegrationEtsy);
    router.get('/test', integrations.getTestConnection);
    router.get('/import', integrations.getImportConnection);
    router.get('/getForDD', integrations.getForDd);
    router.get('/getOnlyProducts', integrations.getOnlyProducts);

    router.get('/:type?', integrations.getCredentials);

    router.post('/:type', integrations.saveIntegrations);
    router.patch('/:id', integrations.saveIntegrations);

    router.put('/:id', integrations.saveIntegrations);

    router.delete('/:id', integrations.deleteIntegration);

    return router;
};

