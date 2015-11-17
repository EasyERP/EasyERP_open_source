var express = require('express');
var router = express.Router();
var PayRollHandler = require('../handlers/payroll');
var redisStore = require('../helpers/redisClient');

module.exports = function (models) {
    "use strict";
    var handler = new PayRollHandler(models);

    function cacheRetriver(req, res, next){
        var query = req.query;
        var filter = query.filter;
        var key = 'payrollExpenses' + filter;

        redisStore.readFromStorage('payrollExpenses', key, function(err, expensesStringObject){
            var expenses;

            if(!expensesStringObject) {
                return next();
            }

            expenses = JSON.parse(expensesStringObject);
            res.status(200).send(expenses);
        });
    };

    router.get('/:viewType', cacheRetriver, handler.getForView);
    router.post('/', handler.create);
    router.post('/generate', handler.generate);
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
    router.delete('/:id', handler.remove);

    return router;
};