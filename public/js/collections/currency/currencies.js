define(['Backbone',
    'models/currency'
], function (Backbone, CurrencyModel) {
    var PaymentCollection = Backbone.Collection.extend({
        model: CurrencyModel,
        url  : '/currency/getForList',

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