var express = require('express');
var router = express.Router();
var CapacityHandler = require('../handlers/capacity');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new CapacityHandler(models);
    var moduleId = MODULES.CAPACITY;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlware, handler.getForType);
    router.post('/', accessStackMiddlware, handler.create);
    router.post('/createNextMonth', accessStackMiddlware, handler.createNextMonth);
    router.post('/create', accessStackMiddlware, handler.createAll);
    router.patch('/', accessStackMiddlware, handler.putchBulk);
    router.patch('/:id', accessStackMiddlware, handler.putchModel);
    router.delete('/:id', accessStackMiddlware, handler.remove);

    return router;
};