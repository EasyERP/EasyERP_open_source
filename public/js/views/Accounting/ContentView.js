define([
    'Backbone',
    'Underscore',
    'text!templates/Accounting/AccountingTemplate.html',
    'async',
    'dataService',
    'collections/paymentMethod/paymentMethods',
    'collections/paymentTerms/paymentTerms',
    'views/Accounting/paymentMethod/paymentMethodView',
    'views/Accounting/paymentTerms/paymentTermsView'
], function (Backbone, _, DashboardTemplate, async, dataService, PayMethodsCollection, PaymentTermsCollection, PaymentMethodView, PaymentTermsView) {
    'use strict';

    var ContentView = Backbone.View.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            this.startTime = options.startTime;

            this.payMethodsCollection = new PayMethodsCollection();
            this.paymentTermsCollection = new PaymentTermsCollection();
            this.payMethodsCollection.bind('reset', this.renderPaymentMethods, this);
            this.paymentTermsCollection.bind('reset', this.renderPaymentTerms, this);

            this.render();
        },

        renderPaymentMethods: function () {
            new PaymentMethodView({
                collection: this.payMethodsCollection
            }).render();
        },

        renderPaymentTerms: function () {
            new PaymentTermsView({
                collection: this.paymentTermsCollection
            }).render();
        },

        render: function () {
            this.$el.html(this.template());
        }

    });

    return ContentView;
});
