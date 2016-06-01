
var express = require('express');
var router = express.Router();
var filterHandler = require('../handlers/filter');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new filterHandler(models);

    router.use(authStackMiddleware);
    
    router.get('/getFiltersValues', handler.getFiltersValues);

    return router;
};