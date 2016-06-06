var express = require('express');
var router = express.Router();
var chartOfAccountHandler = require('../handlers/chartOfAccount');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new chartOfAccountHandler(models);
    var moduleId = MODULES.CHARTOFACCOUNT;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddlware, handler.getForView);
    router.get('/getForDd', accessStackMiddlware, handler.getForDd);
    router.post('/', accessStackMiddlware, handler.create);
    router.delete('/:id', accessStackMiddlware, handler.remove);
    router.patch('/', accessStackMiddlware, handler.putchBulk);

    return router;
};
