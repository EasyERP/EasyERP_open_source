define([
    'Backbone',
    'common',
    'constants'
], function (Backbone, common, CONSTANTS) {
    'use strict';

    var PaymentModel = Backbone.Model.extend({
        idAttribute: '_id',

        defaults: {
            supplier: {
                _id     : null,
                fullName: ''
            },

            bankExpenses: {
                amount : 0,
                account: null
            },

            paidAmount      : 0,
            paymentMethod   : null,
            date            : new Date(),
            name            : 'PP',
            period          : null,
            paymentRef      : null,
            differenceAmount: 0,
            invoice         : null,
            invoiced        : 0
        },

        urlRoot: function () {
            return CONSTANTS.URLS.PAYMENT;
        },

        parse: function (response) {
            var model = response.success || response;
            var differenceAmount = model.differenceAmount || 0;
            var paidAmount = model.paidAmount || 0;
            var invoiced;
            var paid;
            var products = model.products;
            var balance;
            var total;
            var unTaxed;
            var taxes;
            var unitPrice;
            var subTotal;

            differenceAmount = differenceAmount / 100;
            paidAmount = paidAmount / 100;
            invoiced = paidAmount + differenceAmount;
            paid = paidAmount - differenceAmount;

            differenceAmount = differenceAmount.toFixed(2);
            paidAmount = paidAmount.toFixed(2);
            invoiced = invoiced.toFixed(2);
            paid = paid.toFixed(2);

            model.differenceAmount = differenceAmount;
            model.paidAmount = model.refund ? (paidAmount * -1).toFixed(2) : paidAmount;
            model.invoiced = invoiced;
            model.paid = paid;

            if (model.bankExpenses && model.bankExpenses.amount) {
                model.bankExpenses.amount /= 100;
            } else {
                if (!model.bankExpenses) {
                    model.bankExpenses = {};
                }
                model.bankExpenses.amount = 0;
            }

            if (model.paymentInfo) {
                balance = model.paymentInfo.balance || 0;
                total = model.paymentInfo.total || 0;
                unTaxed = model.paymentInfo.unTaxed || 0;

                if (isNaN(paid)) {
                    paid = 0;
                }

                balance = (balance / 100).toFixed(2);
                paid = (paid / 100).toFixed(2);
                total = (total / 100).toFixed(2);
                unTaxed = (unTaxed / 100).toFixed(2);

                model.paymentInfo.balance = balance;
                model.paymentInfo.unTaxed = unTaxed;
                model.paymentInfo.total = total;
                model.paymentInfo.paid = paid;
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

            if (model.date) {
                model.date = common.utcDateToLocaleDate(model.date);
            }

            if (model.period) {
                model.period = common.utcDateToLocaleDate(model.period);
            }

            return model;
        }
    });

    return PaymentModel;
});
