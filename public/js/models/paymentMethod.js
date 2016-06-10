define([
    'Backbone'
], function (Backbone) {
    var paymentMethod = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/paymentMethod';
        }
    });
    return paymentMethod;
});
