define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Tags/EditTag.html',
    'views/selectView/selectView',
    'populate',
    'constants'
], function (Backbone, $, _, EditTemplate, SelectView, populate, CONSTANTS) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem');
            this.collection = options.collection;
            this.render(options);
            this.type = options.type;
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
                color: color
            };

            this.model.save(data, {
                success: function (res, model) {
                    var tags;
                    self.hideDialog();
                    tags = $('.tags [data-id="' + model._id + '"]');

                    tags.each(function () {
                        $(this).attr('data-color', model.color).text(model.name);
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.tag-list-dialog').show();
            $('.edit-tag-dialog').remove();
        },

        deleteItem: function () {
            var self = this;
            var answer = confirm('Really DELETE item ?!');

            if (answer === true) {

                this.model.destroy({
                    wait   : true,
                    success: function (res, model) {
                        self.hideDialog();
                        var tags = $('[data-id="' + model._id + '"]');
                        tags.each(function () {
                            $(this).remove();
                        });
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }
        },

        render: function () {
            var self = this;
            var model = this.model.toJSON();
            var formString = this.template({
                model: model,
                type : this.type
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                position   : {
                    at: "top+38%"
                },
                dialogClass: 'edit-tag-dialog',
                title      : 'Edit Tag',
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
                    },

                    {
                        text : 'Remove',
                        class: 'btn',
                        click: function () {
                            self.deleteItem();
                        }
                    }

                ]

            });

            this.$el.find('.colorBox[data-color="' + model.color + '"]').addClass('checked');

            return this;
        }
    });

    return EditView;
});
