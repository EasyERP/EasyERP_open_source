var express = require('express');
var router = express.Router();
var PayrollComponentTypesHandler = require('../handlers/payrollComponentTypes');

module.exports = function (models) {
    var handler = new PayrollComponentTypesHandler(models);

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
    router.delete('/:id', handler.delete);
    router.patch('/:id', handler.update);

    return router;
};
