var express = require('express');
var router = express.Router();
var WeeklySchedulerHandler = require('../handlers/payrollStructureTypes');

module.exports = function (models) {
    var handler = new WeeklySchedulerHandler(models);

    router.get('/', handler.getForView);
    router.get('/forDd', handler.getForDd);
    router.get('/:id', handler.getById);
    router.post('/', handler.create);
    router.patch('/:id', handler.update);

    router.delete('/:id', handler.delete);

    return router;
};
