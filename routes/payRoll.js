var express = require('express');
var router = express.Router();
var PayRollHandler = require('../handlers/payRoll');

module.exports = function (event, models) {
    var handler = new PayRollHandler(event, models);

    router.get('/:viewType', handler.getForView);
    router.get('/form/:id', handler.getById);
    router.post('/', handler.create);
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
    router.delete('/:id', handler.remove);

    return router;
};