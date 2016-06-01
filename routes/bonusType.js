
var bonusTypeHandler = require('../handlers/bonusType');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new bonusTypeHandler(models);
    var moduleId = MODULES.BONUSTYPE;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlware, handler.getList);
    router.get('/getForDD', accessStackMiddlware, handler.getForDD);
    // router.get('/list/totalCollectionLength', accessStackMiddlware, handler.totalCollectionLength);

    router.post('/', accessStackMiddlware, handler.create);
    router.patch('/', accessStackMiddlware, handler.patchM);
    router.delete('/:_id', accessStackMiddlware, handler.remove);

    return router;
};