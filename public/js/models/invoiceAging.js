define(['Validation', 'common'], function (Validation, common, helpers) {
    "use strict";

    var Model = Backbone.Model.extend({
        idAttribute: "_id",

        parse: function (response) {
            if (response.paymentInfo) {
                response.paymentInfo.balance = parseInt(response.paymentInfo.balance) / 100;
                response.paymentInfo.balance = response.paymentInfo.balance.toFixed(2);
            }

            return response;
        }
    });

    return Model;
});