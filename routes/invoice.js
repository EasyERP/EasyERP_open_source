/**
 * Created by ANDREY on 29.04.2015.
 */

var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoice');

module.exports = function (models) {
    var handler = new InvoiceHandler(models);

    router.get('/', handler.getAll);

    router.get('/totalCollectionLength', handler.totalCollectionLength);

    router.get('/:viewType', function (req, res) {
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                handler.getInvoiceById(req, res);
                break;
            default:
                handler.getForView(req, res);
        }
    });

    router.put('/:_id', function (req, res) {
        var data = {};
        var id = req.param('_id');
        data.invoice = req.body;

        handler.updateInvoice(req, res, id, data);
    });

    router.delete('/:_id', function (req, res) {
        var id = req.param('_id');
        handler.removeInvoice(req, res, id);
    });

    router.post('/', handler.create);


    return router;
};