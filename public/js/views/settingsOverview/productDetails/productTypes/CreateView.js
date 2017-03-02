define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/productTypes/CreateTemplate.html',
    'models/ProductTypeModel',
    'populate',
    'constants',
    'helpers/keyValidator'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator) {
    'use strict';

    var EditView = Parent.extend({
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

        keyDownHandler: function (e) {
            switch (e.which) {
                case 13:
                    this.saveItem();
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
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
            var optionName = $.trim(thisEl.find('#productTypeName').val());

            this.currentModel.save({
                name: optionName
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    self.hideDialog();

                    self.collection.add(model);
                },

                error: function (model, xhr) {
                    App.render({
                        type   : 'error',
                        message: xhr.responseText
                    });
                    //self.errorNotification(xhr);
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
