define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/CreatePaymentTerms.html',
    'text!templates/Accounting/paymentTermsEl.html',
    'views/selectView/selectView',
    'models/paymentTerm',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, template, tableEL, SelectView, Model, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {

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

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var name = thisEl.find('#paymentTermName').val();
            var count = thisEl.find('#paymentTermCount').val();
            var data;

            if (!name) {
                return App.render({type: 'error', message: 'Please, fill field "Name"'});
            }

            data = {
                name : name,
                count: count || 1
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    self.hideDialog();
                    $('#paymentTermsTable').prepend(_.template(tableEL, {elem: model}));
                    self.collection.add(res);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
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
