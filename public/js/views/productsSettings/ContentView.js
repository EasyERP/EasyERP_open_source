define([
    'Backbone',
    'Underscore',
    'text!templates/productsSettings/productsSettingsTemplate.html',
    'async',
    'dataService',
    'collections/paymentMethod/paymentMethods',
    'collections/currency/currencies',
    'collections/paymentTerms/paymentTerms',
    'collections/accountsCategories/filterCollection',
    'views/productsSettings/paymentMethod/paymentMethodView',
    'views/productsSettings/paymentTerms/paymentTermsView',
    'views/productsSettings/currency/currencyView',
    'views/productsSettings/accountsCategories/accCategoryView'
], function (Backbone, _, DashboardTemplate, async, dataService, PayMethodsCollection, CurrencyCollection, PaymentTermsCollection, AccountsCategoriesCollection, PaymentMethodView, PaymentTermsView, CurrencyView, AccCategoryView) {
    'use strict';

    var ContentView = Backbone.View.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            this.startTime = options.startTime;

            this.payMethodsCollection = new PayMethodsCollection();
            this.currencyCollection = new CurrencyCollection();
            this.paymentTermsCollection = new PaymentTermsCollection();
            this.accountsCategoriesCollection = new AccountsCategoriesCollection();
            this.currencyCollection.bind('reset', this.renderCurrencies, this);
            this.payMethodsCollection.bind('reset', this.renderPaymentMethods, this);
            this.paymentTermsCollection.bind('reset', this.renderPaymentTerms, this);
            this.accountsCategoriesCollection.bind('reset', this.renderAccountsCategories, this);
            this.accountsCategoriesCollection.bind('add change remove', this.renderCategories, this);

            this.render();
        },

        events: {
            'click .acountingList-js li': 'chooseDetailes'
        },

        renderCurrencies: function () {
            new CurrencyView({
                collection: this.currencyCollection
            }).render();
        },

        chooseDetailes: function (e) {
            var $target = $(e.target);
            var $thisEl = this.$el;

            var name;

            e.preventDefault();

            if (!$target.hasClass('_acountingListItem')) {
                $target = $target.closest('._acountingListItem');
            }

            $thisEl.find('.acountingList-js .active').removeClass('active');
            $target.addClass('active');

            name = $target.attr('data-id');

            $thisEl.find('.tabs').addClass('hidden');

            $thisEl.find('#' + name + '-holder').removeClass('hidden');

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

        renderAccountsCategories: function () {
            new AccCategoryView({
                collection: this.accountsCategoriesCollection
            }).render();
        },

        renderCategories: function () {

            var collection = new AccountsCategoriesCollection();

            function createView() {
                new AccCategoryView({
                    collection: collection
                }).render();
            }

            collection.bind('reset', createView);
        },

        render: function () {
            this.$el.html(this.template({
                data: [{
                    _id : 'currency',
                    name: 'Currency'
                }, {
                    _id : 'paymentmethods',
                    name: 'Bank Accounts'
                }, {
                    _id : 'paymentterms',
                    name: 'Payment Terms'
                }, {
                    _id : 'accountscategories',
                    name: 'Chart Of Accounts Categories'
                }]
            }));

            return this;
        }

    });

    return ContentView;
});
