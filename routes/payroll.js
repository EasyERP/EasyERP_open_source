var express = require('express');
var router = express.Router();
var PayRollHandler = require('../handlers/payroll');

module.exports = function (models) {
    var handler = new PayRollHandler(models);

    router.get('/:viewType', handler.getForView);
    router.get('/form/:id', handler.getById);
    router.post('/', handler.create);
    router.post('/generate', handler.generate);
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
    router.delete('/:id', handler.remove);

    return router;
};