var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    function checkAuth(req, res, next){
        var error;

        if(!req.session || !req.session.loggedIn){
            error = new Error("Not Authorized");
            error.status = 401;

            return next(error);
        }
        next();
    }

    router.get('/', checkAuth, handler.getAll);
    router.get('/exportToXlsx',handler.exportToXlsx);
    router.get('/exportToCsv',handler.exportToCsv);
    router.get('/:id', checkAuth, handler.getById);

    //router.post('/', handler.create);

    return router;
};