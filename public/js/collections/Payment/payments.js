/**
 * Created by soundstorm on 21.05.15.
 */
define([
        'models/PaymentModel'
    ],
    function (PaymentModel) {
        var PaymentCollection = Backbone.Collection.extend({
            model: PaymentModel,
            url: "/payment/",

            initialize: function (options) {

                this.fetch({
                    reset: true,
                    success: function () {
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) {
                            Backbone.history.navigate('#login', { trigger: true });
                        }
                    }
                });
            },
            parse: function(response){
                return response.success;
            }
        });
        return PaymentCollection;
    });