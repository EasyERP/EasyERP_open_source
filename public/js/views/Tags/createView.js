define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/CreateTag.html',
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
            'click .colorBox'                                  : 'chooseNewColor',
            click                                              : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        chooseNewColor: function (e) {
            var $target = $(e.target);
            this.$el.find('.colorBox').removeClass('checked');
            $target.addClass('checked');
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var name = thisEl.find('#paymentTermName').val();
            var color = thisEl.find('.checked').attr('data-color');

            var data = {
                name: name,
                color : color
            };

            this.currentModel.save(data, {
                wait   : true,
                success: function (res) {

                    self.hideDialog();

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

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
