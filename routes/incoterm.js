

var express = require('express');
var router = express.Router();
var IncotermHandler = require('../handlers/incoterm');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new IncotermHandler(models);
    
    router.use(authStackMiddleware);

    router.get('/', handler.getForDd);

    return router;
};