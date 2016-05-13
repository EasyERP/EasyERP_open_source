define([
        "text!templates/Accounting/AccountingTemplate.html",
        "async",
        "dataService",
        "collections/paymentMethod/paymentMethods",
        "views/Accounting/paymentMethodView"
    ],
    function (DashboardTemplate, async, dataService, payMethodsCollection, paymentMethodView) {
        var ContentView = Backbone.View.extend({
            contentType: "Accounts",
            actionType : "Content",
            template   : _.template(DashboardTemplate),
            el         : '#content-holder',
            initialize : function (options) {
                this.startTime = options.startTime;

                this.payMethodsCollection = new payMethodsCollection();
                this.payMethodsCollection.bind('reset', this.renderPaymentMethods, this);
                this.render();
            },

            renderPaymentMethods: function () {
                new paymentMethodView({
                    collection: this.payMethodsCollection
                }).render();
            },


            render: function () {
                this.$el.html(this.template());
            }

        });
        return ContentView;
    });
