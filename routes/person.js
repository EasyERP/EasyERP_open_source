var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';
    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.PERSONS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.get('/getPersonAlphabet', accessStackMiddleware, handler.getCompaniesAlphabet);
    router.get('/getPersonsForMiniView', handler.getFilterPersonsForMiniView);
    router.get('/:id', handler.getById);

    router.post('/', accessStackMiddleware, handler.create);
    router.put('/:id', accessStackMiddleware, handler.update);
    router.patch('/:id', accessStackMiddleware, handler.udateOnlySelectedFields);
    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
