define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/EditPaymentTerms.html',
    'text!templates/Accounting/paymentTermsEl.html',
    'views/selectView/selectView',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, EditTemplate, tableEL, SelectView, populate, CONSTANTS, keyValidator) {
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

            var name = thisEl.find('#paymentTermName').val();
            var count = thisEl.find('#paymentTermCount').val();

            var data = {
                name : name,
                count: count || 1
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    var el = $('#paymentterms-holder').find('tr[data-id="' + model._id + '"]');
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
                title      : 'Edit Bank Account',
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

            return this;
        }
    });

    return EditView;
});
