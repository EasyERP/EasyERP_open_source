var express = require('express');
var router = express.Router();
var InvoicingControlHandler = require('../handlers/invoicingControl');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new InvoicingControlHandler(models);

    /**
     *@api {get} /invoicingControl/ Request InvoicingControls
     *
     * @apiVersion 0.0.1
     * @apiName getInvoicingControl
     * @apiGroup Invoicing Control
     *
     * @apiSuccess {Object} InvoicingControls
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": "55536564475b7be475f335f3",
            "name": "Based on Purchase Order lines"
        },
        {
            "_id": "55536564475b7be475f335f4",
            "name": "Based on generated draft invoice"
        },
        {
            "_id": "55536564475b7be475f335f5",
            "name": "Based on incoming shipments"
        }
    ]
}
     * */
    router.get('/', authStackMiddleware, handler.getForDd);

    return router;
};
