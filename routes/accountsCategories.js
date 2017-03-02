var express = require('express');
var router = express.Router();
var Handler = require('../handlers/accountsCategories');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new Handler(models);
    var moduleId = MODULES.ACCOUNTSCATEGORIES;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleWare, handler.get);
    router.get('/getAll', accessStackMiddleWare, handler.getAll);
    /* router.get('/getForDd', handler.getForDd);*/

    router.patch('/:id', accessStackMiddleWare, handler.update);

    router.post('/', accessStackMiddleWare, handler.create);

    router.delete('/:id', accessStackMiddleWare, handler.remove);

    return router;
};

