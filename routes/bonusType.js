
var bonusTypeHandler = require('../handlers/bonusType');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new bonusTypeHandler(models);
    var moduleId = MODULES.WORKFLOWS;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/getForDD', authStackMiddleware, accessStackMiddlware, handler.getForDD);
    router.get('/list/totalCollectionLength', authStackMiddleware, accessStackMiddlware, handler.totalCollectionLength);
    router.get('/list', authStackMiddleware, accessStackMiddlware, handler.getList);

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.patch('/',authStackMiddleware, accessStackMiddlware, handler.patchM);
    router.delete('/:_id', authStackMiddleware, accessStackMiddlware, handler.remove);

    return router;
};