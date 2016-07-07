define([
    'Backbone'
], function (Backbone) {
    var InvoiceModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {

        },

        defaults: {
            deductions: [],
            earnings  : []
        },

        urlRoot: function () {
            return '/payrollStructureTypes';
        }
    });
    return InvoiceModel;
});
