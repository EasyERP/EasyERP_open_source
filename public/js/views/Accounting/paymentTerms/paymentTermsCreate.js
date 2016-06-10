define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/CreatePaymentTerms.html',
    'views/selectView/selectView',
    'models/paymentTerm',
    'populate',
    'constants'
], function (Backbone, $, _, template, SelectView, Model, populate, CONSTANTS) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

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
                title        : 'Create Bank Account',
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
