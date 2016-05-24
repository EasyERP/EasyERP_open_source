define(['Backbone',
        'models/paymentTerm'
    ],
    function (Backbone, PaymentModel) {
        var PaymentCollection = Backbone.Collection.extend({
            model: PaymentModel,
            url  : "/paymentTerm/getForList",

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