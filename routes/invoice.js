var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoice');
var multipartMiddleware = require('connect-multiparty')();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new InvoiceHandler(models, event);
    var moduleId = MODULES.INVOICE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddleware, function (req, res, next) {
        var viewType = req.query.viewType;
        switch (viewType) {
            case 'form':
                handler.getInvoiceById(req, res, next);
                break;
            case 'list':
                handler.getForView(req, res, next);
                break;
            default:
                handler.getAll(req, res, next);
        }
    });

    // router.get('/',  authStackMiddleware, accessStackMiddleware, handler.getAll);
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddleware, handler.totalCollectionLength);
    router.get('/getFilterValues', authStackMiddleware, accessStackMiddleware, handler.getFilterValues);
    router.get('/generateName', authStackMiddleware, accessStackMiddleware, handler.generateName);
    router.get('/stats', authStackMiddleware, accessStackMiddleware, handler.getStats);
    router.get('/stats/project', authStackMiddleware, accessStackMiddleware, handler.getStatsForProject);
    router.get('/chart', authStackMiddleware, accessStackMiddleware, handler.chartForProject);

    router.delete('/:_id', authStackMiddleware, accessStackMiddleware, function (req, res) {
        var id = req.param('_id');

        handler.removeInvoice(req, res, id);
    });

    router.patch('/approve', authStackMiddleware, accessStackMiddleware, handler.approve);

    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.updateOnlySelected);

    router.put('/:_id', authStackMiddleware, accessStackMiddleware, function (req, res) {
        var data = {};
        var id = req.params._id;

        data.invoice = req.body;

        handler.updateInvoice(req, res, id, data);
    });

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/receive', authStackMiddleware, accessStackMiddleware, handler.receive);
    router.post('/attach', authStackMiddleware, accessStackMiddleware, multipartMiddleware, handler.attach);

    return router;
};
