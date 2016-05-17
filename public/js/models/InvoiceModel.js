/**
 * Created by ANDREY on 29.04.2015.
 */

define([
    'Backbone',
    'common',
    'constants'
], function (Backbone, common, CONSTANTS) {
    'use strict';

    var InvoiceModel = Backbone.Model.extend({
        idAttribute: "_id",
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
        parse      : function (response) {
            if (response) {
                var payments = response.payments;
                var products = response.products;
                var balance;
                var paid;
                var total;
                var unTaxed;
                var taxes;
                var unitPrice;
                var subTotal;

                if (response.paymentInfo) {
                    balance = response.paymentInfo.balance || 0;
                    total = response.paymentInfo.total || 0;
                    unTaxed = response.paymentInfo.unTaxed || 0;
                    paid = total - balance;

                    if (isNaN(paid)) {
                        paid = 0;
                    }

                    balance = (balance / 100).toFixed(2);
                    paid = (paid / 100).toFixed(2);
                    total = (total / 100).toFixed(2);
                    unTaxed = (unTaxed / 100).toFixed(2);

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

                        unitPrice = (unitPrice / 100).toFixed(2);
                        subTotal = (subTotal / 100).toFixed(2);
                        taxes = (taxes / 100).toFixed(2);

                        product.unitPrice = unitPrice;
                        product.subTotal = subTotal;
                        product.taxes = taxes;

                        return product;
                    });
                }

                if (response.invoiceDate) {
                    response.invoiceDate = common.utcDateToLocaleDate(response.invoiceDate);
                }
                if (response.dueDate) {
                    response.dueDate = common.utcDateToLocaleDate(response.dueDate);
                }
                if (response.paymentDate) {
                    response.paymentDate = common.utcDateToLocaleDate(response.paymentDate);
                }
                if (payments && payments.length) {
                    payments = _.map(payments, function (payment) {
                        if (payment.date) {
                            payment.date = common.utcDateToLocaleDate(payment.date);
                        }
                        return payment;
                    });
                }

                return response;
            }
        },
        validate   : function () {
            var errors = [];

            if (errors.length > 0) {
                return errors;
            }
        },
        defaults   : {
            supplier   : {
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
                unTaxed: 0,
                balance: 0,
                paid   : 0
            }

        },
        urlRoot    : function () {
            return CONSTANTS.URLS.INVOICE;
        }
    });
    return InvoiceModel;
});