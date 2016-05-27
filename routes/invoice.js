var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoice');
var multipartMiddleware = require('connect-multiparty')();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new InvoiceHandler(models, event);
    var moduleId = MODULES.INVOICE;
    var accessStackMiddlware = require('../helpers/access')(moduleId, models);

    router.get('/',  authStackMiddleware, accessStackMiddlware, handler.getAll);
    router.get('/totalCollectionLength',  authStackMiddleware, accessStackMiddlware, handler.totalCollectionLength);
    router.get('/getFilterValues', authStackMiddleware, accessStackMiddlware, handler.getFilterValues);
    router.get('/generateName', authStackMiddleware, accessStackMiddlware, handler.generateName);
    router.get('/stats', authStackMiddleware, accessStackMiddlware, handler.getStats);
    router.get('/stats/project', authStackMiddleware, accessStackMiddlware, handler.getStatsForProject);
    router.get('/chart', authStackMiddleware, accessStackMiddlware, handler.chartForProject);
    router.get('/:viewType', authStackMiddleware, accessStackMiddlware, function (req, res, next) {
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                handler.getInvoiceById(req, res, next);
                break;
            default:
                handler.getForView(req, res, next);
        }
    });

    router.delete('/:_id', authStackMiddleware, accessStackMiddlware, function (req, res) {
        var id = req.param('_id');

        handler.removeInvoice(req, res, id);
    });

    router.patch('/approve', authStackMiddleware, accessStackMiddlware, handler.approve);

    router.patch('/:id', authStackMiddleware, accessStackMiddlware, handler.updateOnlySelected);

    router.put('/:_id', authStackMiddleware, accessStackMiddlware, function (req, res) {
        var data = {};
        var id = req.params._id;

        data.invoice = req.body;

        handler.updateInvoice(req, res, id, data);
    });

    router.post('/', authStackMiddleware, accessStackMiddlware, handler.create);
    router.post('/receive', authStackMiddleware, accessStackMiddlware, handler.receive);
    router.post('/attach', authStackMiddleware, accessStackMiddlware, multipartMiddleware, handler.attach);


    return router;
};