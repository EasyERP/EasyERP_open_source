define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/currency/EditCurrency.html',
    'text!templates/settingsOverview/Accounting/currency/currencyEl.html',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, EditTemplate, tableEL, populate, CONSTANTS, keyValidator) {
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

            this.responseObj = {};
            this.collection = options.collection;

            this.render(options);
        },

        events: {
            'keypress #paymentTermCount': 'keypressHandler'
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var symbol = thisEl.find('#currencySymbol').val();
            var decPlaces = thisEl.find('#decPlaces').val();
            var active = thisEl.find('#active').prop('checked');

            var data = {
                symbol  : symbol,
                decPlace: decPlaces,
                active  : active
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    self.collection.set(model, {remove: false});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e);
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '450px',
                buttons    : [
                    {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            this.$el.find('#decPlaces').spinner({
                min: 0,
                max: 3
            });

            return this;
        }
    });

    return EditView;
});
