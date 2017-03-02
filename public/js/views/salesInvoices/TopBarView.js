define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Invoices/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function ($, _, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SALESINVOICES,
        template   : _.template(ContentTopBarTemplate),
        events     : {
            'click #magentoExport' : 'magentoInvoiceExport',
            'click #magentoImport' : 'magentoInvoiceImport'
        },

        initialize: function (options) {
            this.actionType = options.actionType;
            if (this.actionType !== 'Content') {
                Custom.setCurrentVT('form');
            }
            if (options.collection) {
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
            }

            this.render();

            this.hideSaveCancelBtns();
        },

        magentoInvoiceExport: function (event) {
            event.preventDefault();
            this.trigger('exportToMagento');
        },

        magentoInvoiceImport: function (event) {
            event.preventDefault();
            this.trigger('importFromMagento');
        },

        hideSaveCancelBtns: function () {
            var createBtnEl = $('#top-bar-createBtn');
            var saveBtnEl = $('#top-bar-saveBtn');
            var cancelBtnEl = $('#top-bar-deleteBtn');

            createBtnEl.remove();
            saveBtnEl.hide();
            cancelBtnEl.hide();

            return false;
        }
    });

    return TopBarView;
});
