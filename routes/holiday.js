var express = require('express');
var router = express.Router();
var HolidayHandler = require('../handlers/holiday');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    var handler = new HolidayHandler(models, event);
    var moduleId = MODULES.HOLIDAY;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleWare);

    router.get('/', handler.getForView);
    
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
    router.post('/', handler.create);

    router.delete('/:id', handler.remove);
    router.delete('/', handler.bulkRemove);

    return router;
};
