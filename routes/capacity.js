var express = require('express');
var router = express.Router();
var CapacityHandler = require('../handlers/capacity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new CapacityHandler(models);
    var moduleId = MODULES.CAPACITY;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getForType);
    router.post('/', accessStackMiddleware, handler.create);
    
    router.post('/createNextMonth', accessStackMiddleware, handler.createNextMonth);
    router.post('/create', accessStackMiddleware, handler.createAll);
    router.patch('/', accessStackMiddleware, handler.putchBulk);
    router.patch('/:id', accessStackMiddleware, handler.putchModel);
    
    router.delete('/:id', accessStackMiddleware, handler.remove);

    return router;
};
