var express = require('express');
var router = express.Router();
var GoodsNoteHandler = require('../handlers/goodsOutNote');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new GoodsNoteHandler(models, event);
    var moduleId = MODULES.HOLIDAY;
    /*   var accessStackMiddleWare = require('../helpers/access')(moduleId, models);*/

    /*router.use(authStackMiddleware);*/
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'goodsOutNote', event);
    }
    router.get('/', handler.getForView);
    router.get('/:id', handler.getForView);

    /* router.patch('/',  handler.putchBulk);*/
    router.patch('/:id', handler.updateOnlySelectedFields);
    router.post('/', handler.create);
    router.post('/sendEmail', handler.sendEmail);

    /* router.delete('/:id',  handler.remove);*/
    router.delete('/', accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
