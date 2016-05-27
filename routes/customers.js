var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    "use strict";
    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.COMPANIES;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);
    
    router.use(authStackMiddleware);

    router.get('/', handler.getCustomers);
    router.get('/getCustomersImages', handler.getCustomersImages);
    router.get('/getCompaniesForDd', handler.getCompaniesForDd);
    router.get('/getCompaniesAlphabet', handler.getCompaniesAlphabet);
    // router.get('/exportToXlsx', handler.exportToXlsx);
    // router.get('/exportToCsv', handler.exportToCsv);
    router.get('/totalCollectionLength', accessStackMiddlware, handler.getTotalCount);
    router.get('/:id', accessStackMiddlware, handler.getByViewType);
    router.post('/', accessStackMiddlware, handler.create);
    router.put('/:id', accessStackMiddlware, handler.update);
    router.patch('/:id', accessStackMiddlware, handler.udateOnlySelectedFields);
    router.delete('/:id', accessStackMiddlware, handler.remove);

    // router.get('/form', accessStackMiddlware, handler.getById);
   //  router.get('/list', accessStackMiddlware, handler.getFilterCustomers);
    // router.get('/thumbnails', accessStackMiddlware, handler.getFilterCustomers);
   //  router.get('/:id', accessStackMiddlware, handler.getById);
    
    return router;
};