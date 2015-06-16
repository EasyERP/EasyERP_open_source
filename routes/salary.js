/**
 * Created by soundstorm on 15.06.15.
 */
var express = require('express');
var router = express.Router();
var SalaryHandler = require('../handlers/salary');

module.exports = function (models) {
    var handler = new SalaryHandler(models);

    router.get('/', handler.recalculateCashSalary);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:viewType', handler.getForView);
    /*router.post('/', handler.create);
    router.patch('/:_id', handler.productsUpdateOnlySelectedFields);
    router.delete('/:_id', handler.removeProduct);*/

    return router;
};