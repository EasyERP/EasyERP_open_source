define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/EditCurrency.html',
    'views/selectView/selectView',
    'text!templates/Accounting/currencyEl.html',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, EditTemplate, SelectView, tableEL, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.responseObj = {};

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

            var data = {
                symbol  : symbol,
                decPlace: decPlaces
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    var el = $('#currencyTable').find('tr[data-id="' + model._id + '"]');
                    self.hideDialog();

                    el.after(_.template(tableEL, {elem: model}));
                    el.remove();
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
                width      : '250px',
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
