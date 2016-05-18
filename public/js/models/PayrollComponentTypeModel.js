define(['Validation', 'common'], function (Validation, common) {
    var InvoiceModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {
        },

        urlRoot    : function () {
            return '/payrollComponentTypes';
        }
    });
    return InvoiceModel;
});