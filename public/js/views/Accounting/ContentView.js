define([
    'Backbone',
    'Underscore',
    'text!templates/Accounting/AccountingTemplate.html',
    'async',
    'dataService',
    'collections/paymentMethod/paymentMethods',
    'collections/currency/currencies',
    'collections/paymentTerms/paymentTerms',
    'collections/accountsCategories/filterCollection',
    'collections/rates/filterCollection',
    'views/Accounting/paymentMethod/paymentMethodView',
    'views/Accounting/paymentTerms/paymentTermsView',
    'views/Accounting/currency/currencyView',
    'views/Accounting/accountsCategories/accCategoryView',
    'views/Accounting/rates/indexView'
], function (Backbone, _, DashboardTemplate, async, dataService, PayMethodsCollection, CurrencyCollection, PaymentTermsCollection, AccountsCategoriesCollection, RatesCollection, PaymentMethodView, PaymentTermsView, CurrencyView, AccCategoryView, RatesView) {
    'use strict';

    var ContentView = Backbone.View.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            this.startTime = options.startTime;
            this.type = options.type || 'currency';

            this.payMethodsCollection = new PayMethodsCollection();
            this.currencyCollection = new CurrencyCollection();
            this.paymentTermsCollection = new PaymentTermsCollection();
            this.accountsCategoriesCollection = new AccountsCategoriesCollection();
            this.ratesCollection = new RatesCollection();

            this.currencyCollection.bind('reset', this.renderCurrencies, this);
            this.payMethodsCollection.bind('reset', this.renderPaymentMethods, this);
            this.paymentTermsCollection.bind('reset', this.renderPaymentTerms, this);
            this.accountsCategoriesCollection.bind('reset', this.renderAccountsCategories, this);
            this.ratesCollection.bind('reset', this.renderRates, this);

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

        renderRates: function () {
            new RatesView({
                collection: this.ratesCollection
            }).render();
        },

        addHash: function (hash) {
            var newUrl = '#easyErp/' + this.contentType + '/' + hash;

            Backbone.history.navigate(newUrl, {replace: true});
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

            this.addHash($target.attr('data-id'));

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
                }/*, {
                    _id : 'rates',
                    name: 'Currency Rates'
                }*/]
            }));

            this.$el.find('[data-id="' + this.type + '"]').addClass('active');
            this.$el.find('#' + this.type + '-holder').removeClass('hidden');

            return this;
        }

    });

    return ContentView;
});
