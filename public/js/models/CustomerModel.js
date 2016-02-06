define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var CustomerModel = Backbone.Model().extend({
        url: function () {
            if (this.get('isCompany')) {
                return "/createAccount";
            }

            return "/createCompany";
        }
    });

    return CustomerModel;
});