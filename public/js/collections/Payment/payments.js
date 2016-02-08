/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'Backbone',
        'models/PaymentModel',
        'constants'
    ],
    function (Backbone, PaymentModel, CONSTANTS) {
        'use strict';

        var PaymentCollection = Backbone.Collection.extend({
            model: PaymentModel,
            url  : CONSTANTS.URLS.PAYMENT,

            initialize: function () {

                this.fetch({
                    reset  : true,
                    success: function () {
                    },
                    error  : function (models, xhr) {
                        if (xhr.status === 401) {
                            Backbone.history.navigate('#login', {trigger: true});
                        }
                    }
                });
            }
        });
        return PaymentCollection;
    });