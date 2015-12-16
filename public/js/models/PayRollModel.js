define(['Validation', 'common'], function () {
    var PayRollModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return "/Payroll";
        }
    });
    return PayRollModel;
});