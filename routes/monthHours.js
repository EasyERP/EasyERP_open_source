var MonthHoursHandler = require('../handlers/monthHours');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    var handler = new MonthHoursHandler(event, models);
    var moduleId = MODULES.MONTHHOURS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', function (req, res, next) {
        if (req.query.month) {
            handler.getData(req, res, next);
        } else {
            handler.getList(req, res);
        }
    });
    router.get('/list/totalCollectionLength', handler.totalCollectionLength);
    router.post('/', handler.create);
    router.patch('/', handler.patchM);

    router.delete('/:id', handler.remove);

    return router;
};
