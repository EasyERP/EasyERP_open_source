var Modules = require('../handlers/modules');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (event, models) {
    var handler = new Modules(event, models);
    
    router.use(authStackMiddleware);

    router.get('/', handler.getAllModulesByProfile);
    
    // router.post('/redirectTo', handler.redirectTo);

    return router;
};
