define([
    'Backbone',
    'Underscore',
    'moment',
    'constants'
], function (Backbone, _, moment, CONSTANTS) {
    'use strict';

    var InvoiceModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }
            });
        },

        parse: function (response) {
            var payments;
            var products;
            var balance;
            var paid;
            var total;
            var unTaxed;
            var taxes;
            var unitPrice;
            var subTotal;
            var decimalPlace = 2;

            if (response) {
                payments = response.payments;
                products = response.products;

                if (response.currency && response.currency._id && response.currency._id.decPlace) {
                    decimalPlace = response.currency._id.decPlace;
                }

                if (response.paymentInfo) {
                    balance = response.paymentInfo.balance || 0;
                    total = response.paymentInfo.total || 0;
                    unTaxed = response.paymentInfo.unTaxed || 0;
                    paid = total - balance;

                    if (isNaN(paid)) {
                        paid = 0;
                    }

                    balance = (balance / 100).toFixed(decimalPlace);
                    paid = (paid / 100).toFixed(decimalPlace);
                    total = (total / 100).toFixed(decimalPlace);
                    unTaxed = (unTaxed / 100).toFixed(decimalPlace);

                    response.paymentInfo.balance = balance;
                    response.paymentInfo.unTaxed = unTaxed;
                    response.paymentInfo.total = total;
                    response.paymentInfo.paid = paid;
                }

                if (products) {
                    products = _.map(products, function (product) {

                        unitPrice = product.unitPrice || 0;
                        subTotal = product.subTotal || 0;
                        taxes = product.taxes || 0;

                        unitPrice = (unitPrice / 100).toFixed(decimalPlace);
                        subTotal = (subTotal / 100).toFixed(decimalPlace);
                        taxes = (taxes / 100).toFixed(decimalPlace);

                        product.unitPrice = unitPrice;
                        product.subTotal = subTotal;
                        product.taxes = taxes;

                        return product;
                    });
                }

                if (response.invoiceDate) {
                    response.invoiceDate = moment(response.invoiceDate).format('DD MMM, YYYY');
                }
                if (response.dueDate) {
                    response.dueDate = moment(response.dueDate).format('DD MMM, YYYY');
                }
                if (response.paymentDate) {
                    response.paymentDate = moment(response.paymentDate).format('DD MMM, YYYY');
                }
                if (payments && payments.length) {
                    payments = _.map(payments, function (payment) {
                        if (payment.date) {
                            payment.date = moment(payment.date).format('DD MMM, YYYY');
                        }
                        return payment;
                    });
                }

                if (response.notes) {
                    _.map(response.notes, function (note, index) {
                        note.date = moment(new Date(note.date));

                        // note.date = moment(note.date).format('DD MMM, YYYY, H:mm:ss');

                        if (note.history && (['Invoice Date', 'Due Date', 'Creation Date', 'Payment Date'].indexOf(note.history.changedField) !== -1)) {
                            note.history.changedValue = note.history.changedValue ? moment(new Date(note.history.changedValue)).format('DD MMM, YYYY') : '';
                            note.history.newValue = note.history.newValue ? moment(new Date(note.history.newValue)).format('DD MMM, YYYY') : '';
                            note.history.prevValue = note.history.prevValue ? moment(new Date(note.history.prevValue)).format('DD MMM, YYYY') : '';
                        }
                       /* if (!note.name && note.history && (note.history.changedField === 'Creation Date')) {
                            response.notes.splice(index, 1);
                            response.notes.unshift(note);
                            return;
                        }*/
                        return note;
                    });

                }

                if (response.attachments) {
                    _.map(response.attachments, function (attachment) {
                        attachment.uploadDate = moment(attachment.uploadDate).format('DD MMM, YYYY, H:mm:ss');
                        return attachment;
                    });
                }

                return response;
            }
        },

        validate: function () {
            var errors = [];

            if (errors.length > 0) {
                return errors;
            }
        },

        defaults: {
            supplier: {
                id  : '',
                name: ''
            },

            salesPerson: {
                id  : '',
                name: ''
            },

            fiscalPosition       : '',
            sourceDocument       : '',
            supplierInvoiceNumber: '',
            paymentReference     : '',

            invoiceDate: '',
            dueDate    : '',
            account    : '',
            journal    : '',
            products   : [],
            paymentInfo: {
                total  : 0,
                taxes  : 0,
                unTaxed: 0,
                balance: 0,
                paid   : 0
            }

        },

        urlRoot: function () {
            return CONSTANTS.URLS.INVOICES;
        }
    });
    return InvoiceModel;
});
