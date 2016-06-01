
var express = require('express');
var router = express.Router();
var HolidayHandler = require('../handlers/holiday');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    var handler = new HolidayHandler(models, event);
    var moduleId = MODULES.HOLIDAY;
    var accessStackMiddlWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    
    router.get('/', accessStackMiddlWare, handler.getForView);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.patch('/', accessStackMiddlWare, handler.putchBulk);
    router.patch('/:id', accessStackMiddlWare, handler.putchModel);
    router.delete('/:id', accessStackMiddlWare, handler.remove);
    router.post('/', accessStackMiddlWare, handler.create);

    return router;
};