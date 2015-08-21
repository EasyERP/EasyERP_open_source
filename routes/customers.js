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

    /**
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/customers`
     *
     * This __method__ allows get all customers based on `type`
     *
     * @method customers/
     * @for Customer
     * @namespace EasyERP
     */
    router.get('/', checkAuth, handler.getAll);
    router.get('/:id', checkAuth, handler.getById);
    //router.post('/', handler.create);

    return router;
};