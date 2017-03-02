define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/productOptions/CreateTemplate.html',
    'models/OptionsModel',
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

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                case 13:
                    this.saveItem();
                    break;
                default:
                    break;
            }
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
            var pTypeName = $.trim(thisEl.find('#optionName').val());

            this.currentModel.save({
                name: pTypeName
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
