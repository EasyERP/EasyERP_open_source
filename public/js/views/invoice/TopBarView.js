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
        el           : '#top-bar',
        contentType  : CONSTANTS.INVOICE,
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            this.actionType = options.actionType;
            if (this.actionType !== 'Content') {
                Custom.setCurrentVT('form');
            }

            this.contentHeader = 'Invoices';

            if (options.collection) {
                this.collection = options.collection;
                this.collection.bind('reset', _.bind(this.render, this));
            }

            this.render();

            this.hideSaveCancelBtns();
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
