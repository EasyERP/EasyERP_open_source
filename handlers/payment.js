/**
 * Created by Roman on 04.05.2015.
 */

/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');

var Payment = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    var PaymentSchema = mongoose.Schemas['Payment'];
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var waterfallTasks;

    this.create = function (req, res, next) {
        var body = req.body;
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice;

        function fetchInvoice(waterfallCallback) {
            Invoice.findById(invoiceId, waterfallCallback);
        };

        function savePayment(invoice, waterfallCallback) {
            var payment = new Payment(body);

            payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            payment.name = invoice.sourceDocument;
            payment.whoCanRW = invoice.whoCanRW;
            payment.groups = invoice.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }
                waterfallCallback(null, invoice, payment);
            });
        };

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var tottalToPay = (invoice.paymentInfo) ? invoice.paymentInfo.total : 0;
            var paid = payment.paidAmount;
            var isNotFullPaid;
            var request = {
                query: {
                    wId: 'Invoice',
                    source: 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            tottalToPay = parseFloat(tottalToPay);
            paid = parseFloat(paid);

            isNotFullPaid = paid < tottalToPay;

            if (isNotFullPaid) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function(err, workflow){
                if(err){
                    return waterfallCallback(err);
                }

                invoice.workflow = workflow._id;
                invoice.balance = tottalToPay - paid;
                invoice.save(waterfallCallback);
            });
        };

        waterfallTasks = [fetchInvoice, savePayment, invoiceUpdater];

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: response});
        });
    };
};

module.exports = Payment;