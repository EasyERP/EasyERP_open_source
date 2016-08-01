define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/CreateTag.html',
    'models/TagModel'
], function (Backbone, $, _, template, Model) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(template),

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem');
            this.currentModel = new Model();
            this.render(options);
        },

        events: {
            'click .colorBox': 'chooseNewColor'
        },

        chooseNewColor: function (e) {
            var $target = $(e.target);

            this.$el.find('.colorBox').removeClass('checked');
            $target.addClass('checked');
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var name = thisEl.find('#tagName').val();
            var color = thisEl.find('.checked').attr('data-color');

            var data = {
                name : name,
                color: color,
                type : 'Category'
            };
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
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                position     : {
                    at: "top+38%"
                },
                dialogClass  : 'create-dialog task-dialog',
                title        : 'Create Tag',
                width        : '300px',
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
