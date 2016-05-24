/**
 * Created by liliy on 28.01.2016.
 */
var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    'use strict';
    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.PERSONS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/getPersonAlphabet', authStackMiddleware, accessStackMiddlware, handler.getCompaniesAlphabet);
    router.get('/getPersonsForMiniView', authStackMiddleware, handler.getFilterPersonsForMiniView);
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddlware, handler.getTotalCount);
    router.get('/:id', authStackMiddleware, accessStackMiddlware, handler.getByViewType);

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.put('/:id', authStackMiddleware, accessStackMiddlware, handler.update);
    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.udateOnlySelectedFields);
    router.delete('/:id', authStackMiddleware, accessStackMiddlware, handler.remove);
    //router.get('/form', authStackMiddleware, accessStackMiddlware, handler.getById);
    //router.get('/list', authStackMiddleware, accessStackMiddlware, handler.getFilterCustomers);
    //router.get('/thumbnails', authStackMiddleware, accessStackMiddlware, handler.getFilterCustomers);
    return router;
};