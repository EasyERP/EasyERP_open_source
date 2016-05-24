define(['Backbone',
        'text!templates/Accounting/AccountingTemplate.html',
        'async',
        'dataService',
        'collections/paymentMethod/paymentMethods',
        'collections/paymentTerms/paymentTerms',
        'views/Accounting/paymentMethod/paymentMethodView',
        'views/Accounting/paymentTerms/paymentTermsView'
    ],
    function (Backbone, DashboardTemplate, async, dataService, payMethodsCollection, paymentTermsCollection, paymentMethodView, paymentTermsView) {
        var ContentView = Backbone.View.extend({
            contentType: "Accounts",
            actionType : "Content",
            template   : _.template(DashboardTemplate),
            el         : '#content-holder',
            initialize : function (options) {
                this.startTime = options.startTime;

                this.payMethodsCollection = new payMethodsCollection();
                this.paymentTermsCollection = new paymentTermsCollection();
                this.payMethodsCollection.bind('reset', this.renderPaymentMethods, this);
                this.paymentTermsCollection.bind('reset', this.renderPaymentTerms, this);
                this.render();
            },

            renderPaymentMethods: function () {
                new paymentMethodView({
                    collection: this.payMethodsCollection
                }).render();
            },
            renderPaymentTerms: function () {
                new paymentTermsView({
                    collection: this.paymentTermsCollection
                }).render();
            },

            render: function () {
                this.$el.html(this.template());
            }

        });
        return ContentView;
    });
