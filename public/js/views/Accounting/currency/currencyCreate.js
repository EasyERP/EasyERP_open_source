define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/selectView/selectView',
    'text!templates/Accounting/CreateCurrency.html',
    'text!templates/Accounting/currencyEl.html',
    'models/currency',
    'populate'
], function (Backbone, $, _, SelectView, template, tableEL, Model, populate) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();
            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'click .current-selected'                          : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var name = thisEl.find('#allCurrencies').attr('data-id');
            var symbol = thisEl.find('#currencySymbol').val();
            var decPlaces = thisEl.find('#decimalPlaces').val();

            var data = {
                name    : name,
                symbol  : symbol,
                decPlace: decPlaces
            };

            if (!symbol) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Symbol'
                });
            }

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    self.hideDialog();
                    $('#currencyTable').prepend(_.template(tableEL, {elem: model}));
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
            $(e.target).closest('.current-selected').text($(e.target).attr('id')).attr('data-id', $(e.target).attr('id'));

            this.hideNewSelect();
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

            populate.get('#allCurrencies', '/currency/getAll', {}, 'name', this, false);

            return this;
        }
    });

    return EditView;
});
