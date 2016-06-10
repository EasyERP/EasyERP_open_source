var express = require('express');
var router = express.Router();
var PayRollHandler = require('../handlers/payroll');
var redisStore = require('../helpers/redisClient');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';

    var handler = new PayRollHandler(models);
    var moduleId = MODULES.PAYROLLEXPENSES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    function cacheRetriver(req, res, next) {
        var query = req.query;
        var filter = query.filter;
        var key = 'payrollExpenses' + filter;

        redisStore.readFromStorage('payrollExpenses', key, function (err, expensesStringObject) {
            var expenses;

            if (!expensesStringObject) {
                return next();
            }

            expenses = JSON.parse(expensesStringObject);
            res.status(200).send(expenses);
        });
    }

    router.get('/', cacheRetriver, handler.getForView);

    // router.get('/', handler.getSorted);
    router.get('/getAsyncData', handler.getAsyncData);
    
    router.post('/', handler.create);
    router.post('/generate', handler.generate);
    router.post('/recount', handler.recount);
    router.patch('/', handler.putchBulk);
    router.patch('/byDataKey', handler.patchByDataKey);
    router.patch('/:id', handler.putchModel);
    
    router.delete('/byDataKey', handler.removeByDataKey);
    router.delete('/:id', handler.remove);

    return router;
};
