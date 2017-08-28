define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/CreateTag.html',
    'views/selectView/selectView',
    'models/TagModel',
    'populate',
    'constants'
], function (Backbone, $, _, template, SelectView, Model, populate, CONSTANTS) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem');
            this.currentModel = new Model();
            this.type = options.type;

            this.render(options);
        },

        events: {
            'click .colorBox': 'chooseNewColor'
        },

        chooseNewColor: function (e) {
            var $target = $(e.target);

            this.$el.find('.colorBox').removeClass('checked icon-checked2');
            $target.addClass('checked icon-checked2');
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var name = thisEl.find('#tagName').val();
            var color = thisEl.find('.checked').attr('data-color');

            var data = {
                name : name,
                color: color,
                type : this.type
            };
            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose name!'
                });
            }
            if (!color) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose color!'
                });
            }

            this.currentModel.save(data, {
                wait   : true,
                success: function (res, model) {
                    self.collection.add(model);
                    self.hideDialog();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.tag-list-dialog').show();
            $('.create-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({
                model: this.currentModel.toJSON(),
                type : this.type
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                position   : {
                    at: "top+38%"
                },
                dialogClass: 'create-dialog task-dialog',
                title      : 'Create Tag',
                width      : '300px',
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

            this.delegateEvents(this.events);

            return this;
        }
    });

    return EditView;
});
