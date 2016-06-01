
var MonthHoursHandler = require('../handlers/monthHours');
var express = require('express');
var router = express.Router();


module.exports = function (event, models) {
    var handler = new MonthHoursHandler(event, models);

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

    router.delete('/:_id', function (req, res) {
        var id = req.param('_id');

        handler.remove(req, res, id);
    });

    return router;
};