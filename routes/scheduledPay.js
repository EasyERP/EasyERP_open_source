var express = require('express');
var router = express.Router();
var ScheduledPayHandler = require('../handlers/scheduledPay');

module.exports = function (models) {
    var handler = new ScheduledPayHandler(models);

    router.get('/', handler.getForView);
    router.get('/forDd', handler.getForDd);

    router.post('/', handler.create);
    router.patch('/:id', handler.update);

    router.delete('/:id', handler.delete);

    return router;
};
