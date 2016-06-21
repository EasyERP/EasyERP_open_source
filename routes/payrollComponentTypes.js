var express = require('express');
var router = express.Router();
var PayrollComponentTypesHandler = require('../handlers/payrollComponentTypes');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PayrollComponentTypesHandler(models);
    var moduleId = 103;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);
    
    router.get('/forDd/:type', handler.getForDd);
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
