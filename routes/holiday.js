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

    router.get('/', accessStackMiddleWare, handler.getForView);
    router.patch('/', accessStackMiddleWare, handler.putchBulk);
    router.patch('/:id', accessStackMiddleWare, handler.putchModel);
    router.delete('/:id', accessStackMiddleWare, handler.remove);
    router.post('/', accessStackMiddleWare, handler.create);

    return router;
};
