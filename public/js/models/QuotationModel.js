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
            invoiceControl: null,
            invoiceRecived: false,
            paymentTerm: null,
            fiscalPosition: null,
            destination: null,
            incoterm: null,
            products: []
        },
        urlRoot: function () {
            return "/quotation";
        }
    });

    return QuotationModel;
});