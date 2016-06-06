/**
 * Created by Roman on 04.05.2015.
 */
define([
    'Backbone',
    'common',
    'constants'
], function (Backbone, common, CONSTANTS) {
    'use strict';

    var QuotationModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            supplier         : {
                _id : null,
                name: ''
            },
            project          : {
                _id           : null,
                projectnamager: {},
                name          : ''
            },
            workflow         : {
                _id : null,
                name: ''
            },
            supplierReference: '',
            /*deliverTo: null,*/
            orderDate        : new Date(),
            expectedDate     : null,
            name             : 'PO',
            invoiceControl   : null,
            invoiceRecived   : false,
            paymentTerm      : null,
            fiscalPosition   : null,
            destination      : null,
            incoterm         : null,
            products         : []
        },
        urlRoot : function () {
            return CONSTANTS.URLS.QUOTATION;
        },
        parse   : function (model) {
            var products = model.products;
            var total;
            var unTaxed;
            var taxes;
            var unitPrice;
            var subTotal;

            if (model.paymentInfo) {
                total = model.paymentInfo.total || 0;
                unTaxed = model.paymentInfo.unTaxed || 0;
                taxes = model.paymentInfo.taxes || 0;

                total = (total / 100).toFixed(2);
                unTaxed = (unTaxed / 100).toFixed(2);
                taxes = (taxes / 100).toFixed(2);

                model.paymentInfo.unTaxed = unTaxed;
                model.paymentInfo.total = total;
                model.paymentInfo.taxes = taxes;
            }

            if (products) {
                products = _.map(products, function (product) {
                    if (product.scheduledDate) {
                        product.scheduledDate = common.utcDateToLocaleDate(new Date(product.scheduledDate));
                    }

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
            if (model.expectedDate) {
                model.expectedDate = common.utcDateToLocaleDate(new Date(model.expectedDate));
            }
            if (model.orderDate) {
                model.orderDate = common.utcDateToLocaleDate(new Date(model.orderDate));
            }
            return model;
        }
    });

    return QuotationModel;
});