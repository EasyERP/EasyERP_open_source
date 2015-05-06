/**
 * Created by Roman on 04.05.2015.
 */
define(['Validation', 'common'], function (Validation, common) {
    var QuotationModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function () {

        },
        defaults: {
            supplier: null,
            supplierReference: '',
            /*deliverTo: null,*/
            orderDate: new Date(),
            expectedDate: null,
            name: 'PO',
            ncoterm: String,
            invoiceControl: 'Based on generated draft invoice',
            invoiceRecived: false,
            paymentTerm: null,
            fiscalPosition: null,
            products: []
        },
        urlRoot: function () {
            return "/quotation";
        }
    });

    return QuotationModel;
});