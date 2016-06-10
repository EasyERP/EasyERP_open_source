define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/EditPaymentMethods.html',
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

        events: {
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click'                                            : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        showNewSelect: function (e) {
            var $target = $(e.target);
            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text());

            this.hideNewSelect();
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var name = thisEl.find('#paymentMethodName').val();
            var account = thisEl.find('#account').val();
            var currency = $.trim(thisEl.find('#currency').text());
            var bank = thisEl.find('#bankName').val();

            var data = {
                currency: currency,
                name    : name,
                account : account,
                bank    : bank
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
                width        : '550px',
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
