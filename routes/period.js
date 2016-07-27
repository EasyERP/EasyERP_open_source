var express = require('express');
var router = express.Router();
var PeriodHandler = require('../handlers/period');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PeriodHandler(models);

    router.use(authStackMiddleware);
    
    router.get('/', handler.getForDd);

    return router;
};
