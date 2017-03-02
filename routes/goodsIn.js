var express = require('express');
var router = express.Router();
var GoodsNoteHandler = require('../handlers/goodsInNote');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new GoodsNoteHandler(models, event);

    router.post('/', handler.create);
    router.post('/return', handler.createReturn);

    // router.delete('/', handler.bulkRemove);

    return router;
};
