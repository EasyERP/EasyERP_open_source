define([
    'Backbone'
], function (Backbone) {
    var InvoiceModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {

        },

        defaults: {
            deduction: [],
            earning  : []
        },

        urlRoot: function () {
            return '/payrollStructureTypes';
        }
    });
    return InvoiceModel;
});