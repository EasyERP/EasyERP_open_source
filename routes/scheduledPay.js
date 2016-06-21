var express = require('express');
var router = express.Router();
var ScheduledPayHandler = require('../handlers/scheduledPay');

module.exports = function (models) {
    var handler = new ScheduledPayHandler(models);

    router.get('/forDd', handler.getForDd);
    router.get('/:viewType', function (req, res, next) {
        var viewType = req.params.viewType;
        switch (viewType) {
            case 'form':
                handler.getInvoiceById(req, res, next);
                break;
            default:
                handler.getForView(req, res, next);
        }
    });

    router.post('/', handler.create);
    router.patch('/:id', handler.update);

    router.delete('/:id', handler.delete);

    return router;
};
