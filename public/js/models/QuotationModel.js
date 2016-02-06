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
                projectName   : ''
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

            if (products) {
                products = _.map(products, function (product) {
                    if (product.scheduledDate) {
                        product.scheduledDate = common.utcDateToLocaleDate(product.scheduledDate);
                    }

                    return product;
                });
            }
            if (model.expectedDate) {
                model.expectedDate = common.utcDateToLocaleDate(model.expectedDate);
            }
            if (model.orderDate) {
                model.orderDate = common.utcDateToLocaleDate(model.orderDate);
            }
            return model;
        }
    });

    return QuotationModel;
});