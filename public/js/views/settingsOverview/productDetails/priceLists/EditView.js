define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/priceLists/EditTemplate.html',
    'views/selectView/selectView',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, EditTemplate, SelectView, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'keypress #paymentTermCount': 'keypressHandler'
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var currency = this.$el.find('#currencyDd').data('id');
            var priceListName = $.trim($thisEl.find('#priceListName').val());
            var priceListCode = $.trim($thisEl.find('#priceListCode').val());
            var cost = $thisEl.find('#yes').prop('checked') || false;

            var data = {};

            data.name = priceListName;
            data.currencyId = currency;
            data.priceListCode = priceListCode;
            data.cost = cost;

            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                patch  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.set(model, {remove: false});
                },

                error: function (model, response) {
                    App.render({
                        type   : 'error',
                        message: response.error
                    });
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true, false, null, null, this.$el);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
