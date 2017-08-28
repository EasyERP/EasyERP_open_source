define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/priceLists/CreateTemplate.html',
    'models/PriceListsModel',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'priceList',

        initialize: function (options) {
            options = options || {};

            if (options.eventsChannel) {
                this.eventsChannel = options.eventsChannel;
            }

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #paymentTermCount': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var mid = 39;
            var priceListName = $.trim(thisEl.find('#priceListName').val());
            var priceListCode = $.trim(thisEl.find('#priceListCode').val());
            var currency = thisEl.find('#currencyDd').data('id');
            var cost = thisEl.find('#yes').prop('checked') || false;

            this.currentModel.save({
                name         : priceListName,
                priceListCode: priceListCode,
                currencyId   : currency,
                cost         : cost
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    if (self.eventsChannel) {
                        return self.eventsChannel.trigger('savePriceList', model);
                    }

                    self.hideDialog();
                    self.collection.add(model);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            if (this.eventsChannel) {
                return this.eventsChannel.trigger('closeCreatePriceList');
            }

            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Bank Account',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        if (self.eventsChannel) {
                            return self.eventsChannel.trigger('closeCreatePriceList');
                        }

                        self.hideDialog();
                    }
                }]

            });
            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
