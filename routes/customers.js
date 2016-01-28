var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models, event) {
    var handler = new CustomerHandler(models, event);

    function checkAuth(req, res, next){
        var error;

        if(!req.session || !req.session.loggedIn){
            error = new Error("Not Authorized");
            error.status = 401;

            return next(error);
        }
        next();
    }

    router.get('/', handler.getCustomers);
    router.get('/getCustomersImages', handler.getCustomersImages);
    router.get('/getCompaniesForDd', handler.getCompaniesForDd);
    router.get('/getCompaniesAlphabet', handler.getCompaniesAlphabet);
    router.get('/exportToXlsx',handler.exportToXlsx);
    router.get('/exportToCsv',handler.exportToCsv);
    router.get('/form', checkAuth, handler.getById);
    router.get('/list', handler.getFilterCustomers);
    router.get('/thumbnails', handler.getFilterCustomers);

    router.get('/:id', checkAuth, handler.getById);

    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.patch('/:id', handler.udateOnlySelectedFields);
    router.delete('/:id', handler.remove);



    return router;
};