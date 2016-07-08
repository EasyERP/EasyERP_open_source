define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var paymentMethod = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot    : function () {
            return '/tags';
        }
    });
    return paymentMethod;
});
