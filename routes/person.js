/**
 * Created by liliy on 28.01.2016.
 */
var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models, event) {
    var handler = new CustomerHandler(models, event);

    router.get('/form', handler.getById);
    router.get('/list', handler.getFilterCustomers);
    router.get('/thumbnails', handler.getFilterCustomers);
    router.get('/getPersonAlphabet', handler.getCompaniesAlphabet);
    router.get('/getPersonsForMiniView', handler.getFilterPersonsForMiniView);
    router.get('/totalCollectionLength', handler.getTotalCount);

    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.patch('/:id', handler.udateOnlySelectedFields);
    router.delete('/:id', handler.remove);


    return router;
};