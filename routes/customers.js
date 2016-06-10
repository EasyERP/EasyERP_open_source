var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';

    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.COMPANIES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getByViewType);

    router.get('/getCustomersImages', handler.getCustomersImages);
    router.get('/getCompaniesForDd', handler.getCompaniesForDd);
    router.get('/getCompaniesAlphabet', handler.getCompaniesAlphabet);
    router.get('/:id', handler.getById);
    // router.get('/exportToXlsx', handler.exportToXlsx);
    // router.get('/exportToCsv', handler.exportToCsv);
    router.post('/', accessStackMiddleware, handler.create);
    router.put('/:id', accessStackMiddleware, handler.update);
    router.patch('/:id', accessStackMiddleware, handler.udateOnlySelectedFields);
    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
