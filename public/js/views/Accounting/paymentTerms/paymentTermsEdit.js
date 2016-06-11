define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/EditPaymentTerms.html',
    'views/selectView/selectView',
    'populate',
    'constants'
], function (Backbone, $, _, EditTemplate, SelectView, populate, CONSTANTS) {
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

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var name = thisEl.find('#paymentTermName').val();

            var data = {
                name: name
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (res) {
                    var url = window.location.hash;

                    if (url === '#easyErp/Accounts') {
                        self.hideDialog();
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});
                    } else {
                        self.hideDialog();
                    }
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
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Bank Account',
                width        : '250px',
                buttons      : [
                    {
                        text : 'Save',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            populate.get('#currency', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            return this;
        }
    });

    return EditView;
});
