var express = require('express');
var router = express.Router();
var IndustryHandler = require('../handlers/industry');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new IndustryHandler(models);

    router.use(authStackMiddleware);
    
    router.get('/', handler.getForDd);

    return router;
};
