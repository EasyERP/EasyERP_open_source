define([
    'Backbone'
], function (Backbone) {
    var paymentMethod = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/currency';
        }
    });
    return paymentMethod;
});
