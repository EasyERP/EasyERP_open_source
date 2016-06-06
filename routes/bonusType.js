var bonusTypeHandler = require('../handlers/bonusType');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new bonusTypeHandler(models);
    var moduleId = MODULES.BONUSTYPE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getList);
    router.get('/getForDD', accessStackMiddleware, handler.getForDD);

    router.post('/', accessStackMiddleware, handler.create);
    router.patch('/', accessStackMiddleware, handler.patchM);
    router.delete('/:_id', accessStackMiddleware, handler.remove);

    return router;
};
