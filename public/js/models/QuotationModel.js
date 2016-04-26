/**
 * Created by Roman on 04.05.2015.
 */
define(['Validation', 'common'], function (Validation, common) {
    var QuotationModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {

        },
        defaults   : {
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
        urlRoot    : function () {
            return "/quotation";
        },
        parse      : function (model) {
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

                total = (total / 100);
                unTaxed = (unTaxed / 100);
                taxes = (taxes / 100);

                model.paymentInfo.unTaxed = unTaxed;
                model.paymentInfo.total = total;
                model.paymentInfo.taxes = taxes;
            }

            if (products) {
                products = _.map(products, function (product) {
                    if (product.scheduledDate) {
                        product.scheduledDate = common.utcDateToLocaleDate(product.scheduledDate);
                    }

                    unitPrice = product.unitPrice || 0;
                    subTotal = product.subTotal || 0;
                    taxes = product.taxes || 0;

                    unitPrice = unitPrice / 100;
                    subTotal = subTotal / 100;
                    taxes = taxes / 100;

                    product.unitPrice = unitPrice;
                    product.subTotal = subTotal;
                    product.taxes = taxes;

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