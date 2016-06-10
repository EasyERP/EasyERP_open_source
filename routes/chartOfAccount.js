var express = require('express');
var router = express.Router();
var chartOfAccountHandler = require('../handlers/chartOfAccount');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new chartOfAccountHandler(models);
    var moduleId = MODULES.CHARTOFACCOUNT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, handler.getForView);
    router.get('/getForDd', accessStackMiddleware, handler.getForDd);

    router.post('/', accessStackMiddleware, handler.create);
    router.patch('/', accessStackMiddleware, handler.putchBulk);

    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.delete('/', accessStackMiddleware, handler.bulkRemove);

    return router;
};
