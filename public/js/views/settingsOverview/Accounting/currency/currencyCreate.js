define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/currency/CreateCurrency.html',
    'text!templates/settingsOverview/Accounting/currency/currencyEl.html',
    'models/currency',
    'populate'
], function (Backbone, $, _, Parent, template, tableEL, Model, populate) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(template),
        contentType: 'currency',

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();
            this.collection = options.collection;

            this.responseObj = {};

            this.render(options);
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            //var name = thisEl.find('#allCurrencies').attr('data-id');
            var name = thisEl.find('#allCurrencies').val();
            var symbol = thisEl.find('#currencySymbol').val();
            var decPlaces = thisEl.find('#decimalPlaces').val();
            var active = thisEl.find('#active').prop('checked');


            var data = {
                name    : name,
                symbol  : symbol,
                active  : active,
                decPlace: decPlaces
            };

            var checkCurrency = _.find(self.collection.toJSON(), function (currencyModel) {
                return currencyModel._id === name;
            });

            if (!symbol) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Symbol'
                });
            }



            if (checkCurrency) {
                return App.render({
                    type   : 'error',
                    message: 'This currency is it already!'
                });
            }

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'Please choose Currency name'
                });
            }

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    self.hideDialog();
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
                width      : '450px',
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
