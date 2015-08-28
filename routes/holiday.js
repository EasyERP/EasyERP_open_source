
var express = require('express');
var router = express.Router();
var HolidayHandler = require('../handlers/holiday');

module.exports = function (models) {
    var handler = new HolidayHandler(models);

    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:viewType', handler.getForView);
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
    router.delete('/:id', handler.remove);
    router.post('/', handler.create);

    return router;
};