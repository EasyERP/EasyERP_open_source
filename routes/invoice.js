

var express = require('express');
var router = express.Router();
var InvoiceHandler = require('../handlers/invoice');

module.exports = function (models) {
    var handler = new InvoiceHandler(models);

    router.get('/', handler.getAll);

    router.get('/totalCollectionLength', handler.totalCollectionLength);

    router.get('/getFilterValues', handler.getFilterValues);

    router.get('/generateName', handler.generateName);
    
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

    router.delete('/:_id', function (req, res) {
        var id = req.param('_id');
        handler.removeInvoice(req, res, id);
    });

    router.patch('/:id', handler.updateOnlySelected);

    router.put('/:_id', function (req, res) {
        var data={};
        data.invoice= req.body;
        //data.invoice = req.body;
        /*var data = {};
         for (var i in req.query) {
         data[i] = req.query[i];
         }*/

        var id = req.param('_id');

        handler.updateInvoice(req, res, id, data);
    });

    router.post('/', handler.create);
    router.post('/receive', handler.receive);


    return router;
};