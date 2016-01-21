/**
 * Created by liliy on 20.01.2016.
 */
var express = require('express');
var router = express.Router();
var SalaryHandler = require('../handlers/payroll');
var redisStore = require('../helpers/redisClient');

module.exports = function (models) {
    var handler = new SalaryHandler(models);

    function cacheRetriver(req, res, next){
        var query = req.query;
        var filter = query.filter;
        var year = query.year;
        var key = 'salaryReport' + JSON.stringify(filter) + year;

        redisStore.readFromStorage('salaryReport', key, function(err, expensesStringObject){
            var expenses;

            if(!expensesStringObject) {
                return next();
            }

            expenses = JSON.parse(expensesStringObject);
            res.status(200).send(expenses);
        });
    }

    router.get('/list', cacheRetriver, handler.getSalaryReport);

    return router;
};