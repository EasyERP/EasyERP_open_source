var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoice');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    var handler = new InvoiceHandler(models, event);
    var moduleId = MODULES.INVOICE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', function (req, res, next) {
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

    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/generateName', handler.generateName);
    router.get('/stats', handler.getStats);
    router.get('/stats/project', handler.getStatsForProject);
    router.get('/chart', handler.chartForProject);

    router.patch('/approve', accessStackMiddleware, handler.approve);
    router.patch('/:id', handler.updateOnlySelected);
    router.put('/:_id', function (req, res) {
        var data = {};
        var id = req.params._id;

        data.invoice = req.body;

        handler.updateInvoice(req, res, id, data);
    });
    router.post('/', handler.create);
    router.post('/receive', handler.receive);
    // router.post('/attach', multipartMiddleware, handler.attach);
    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    router.delete('/:_id', function (req, res) {
        var id = req.param('_id');

        handler.removeInvoice(req, res, id);
    });
    router.delete('/', handler.bulkRemove);

    return router;
};
