
var MonthHoursHandler = require('../handlers/monthHours');
var express = require('express');
var router = express.Router();


module.exports = function (models) {
    var handler = new MonthHoursHandler(models);

    router.post('/', handler.create);
    router.patch('/', handler.patchM);
    router.get('/list/totalCollectionLength', handler.totalCollectionLength);

    router.get('/list', function (req, res, next) {
            if (req.query.month) {
                handler.getData(req, res, next);
            } else {
                handler.getList(req, res);
            }
        });

    router.delete('/:_id', function (req, res) {
        var id = req.param('_id');

        handler.remove(req, res, id);
    });

    return router;
};