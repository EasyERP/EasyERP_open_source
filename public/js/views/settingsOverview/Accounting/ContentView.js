define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/AccountingTemplate.html',
    'collections/paymentMethod/paymentMethods',
    'collections/currency/currencies',
    'collections/paymentTerms/paymentTerms',
    'collections/accountsCategories/filterCollection',
    'collections/rates/filterCollection',
    'collections/taxSettings/filterCollection',
    'collections/expensesCategories/filterCollection',
    'views/settingsOverview/Accounting/paymentMethod/paymentMethodView',
    'views/settingsOverview/Accounting/paymentTerms/paymentTermsView',
    'views/settingsOverview/Accounting/currency/currencyView',
    'views/settingsOverview/Accounting/accountsCategories/accCategoryView',
    'views/settingsOverview/Accounting/rates/indexView',
    'views/settingsOverview/Accounting/taxes/TaxListView',
    'views/settingsOverview/Accounting/expensesCategories/expensesCategoryView',
    'views/settingsOverview/Accounting/defaults/ContentView',
    'async',
    'dataService'
], function (Backbone, $, _, Parent, DashboardTemplate, PayMethodsCollection, CurrencyCollection, PaymentTermsCollection, AccountsCategoriesCollection, RatesCollection, TaxCollection, ExpensesCategoryCollection, PaymentMethodView, PaymentTermsView, CurrencyView, AccCategoryView, RatesView, TaxView, ExpensesCategoryView, DefaultsView, async, dataService) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            var self = this;
            this.startTime = options.startTime;

            $('#top-bar').hide();

            this.payMethodsCollection = new PayMethodsCollection();
            this.currencyCollection = new CurrencyCollection();
            this.paymentTermsCollection = new PaymentTermsCollection();
            this.accountsCategoriesCollection = new AccountsCategoriesCollection();
            this.expensesCategoriesCollection = new ExpensesCategoryCollection();
            this.ratesCollection = new RatesCollection();
            this.taxCollection = new TaxCollection();

            this.currencyCollection.bind('reset', this.renderCurrencies, this);
            this.payMethodsCollection.bind('reset', this.renderPaymentMethods, this);
            this.paymentTermsCollection.bind('reset', this.renderPaymentTerms, this);
            this.accountsCategoriesCollection.bind('reset', this.renderAccountsCategories, this);
            this.expensesCategoriesCollection.bind('reset', this.renderExpensesCategories, this);
            this.ratesCollection.bind('reset', this.renderRates, this);
            this.taxCollection.bind('reset', this.renderTaxes, this);

            dataService.getData('/organizationSettings', {}, function (data) {

                self.renderDefaults(data);
            });

            this.render();
        },

        renderDefaults: function (data) {
            new DefaultsView({
                data: data
            });
        },

        renderCurrencies: function () {
            new CurrencyView({
                collection: this.currencyCollection
            }).render();
        },

        renderTaxes: function () {
            new TaxView({
                collection: this.taxCollection
            }).render();
        },

        renderRates: function () {
            new RatesView({
                collection: this.ratesCollection
            }).render();
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

        renderExpensesCategories: function () {
            new ExpensesCategoryView({
                collection: this.expensesCategoriesCollection
            }).render();
        },

        render: function () {
            var self = this;
            var formString = this.template();

            this.$el.html(formString);

            /* this.$el = $(formString).dialog({
             autoOpen     : true,
             resizable    : true,
             dialogClass  : 'edit-dialog',
             title        : 'Edit Person',
             width        : '900px',
             position     : {within: $('#wrapper')},
             buttons      : [{
             id   : 'create-orgSettings-dialog',
             class: 'btn blue',
             text : 'Save',

             click: function () {
             self.saveItem();
             }
             }, {
             text : 'Cancel',
             class: 'btn',

             click: function () {
             self.hideDialog();
             }
             }]

             });

             this.delegateEvents(this.events);*/

            return this;
        }

    });

    return ContentView;
});
