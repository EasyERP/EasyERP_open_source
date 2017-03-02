define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/scheduledPay/EditTemplate.html'
], function ($, _, Backbone, CreateTemplate) {

    var EditView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'scheduledPay',
        template   : _.template(CreateTemplate),

        events: {
            keydown: 'keyDownHandler'
        },

        initialize: function (options) {
            var self = this;

            self.model = options.model;
            self.eventChannel = options.eventChannel;

            self.render();
        },

        keyDownHandler: function (e) {
            if (e.which === 13) {
                this.saveItem(e);
            }
        },

        saveItem: function (e) {
            var self = this;
            var model;
            var $currentEl = this.$el;
            var name = $.trim($currentEl.find('#scheduledPayName').val());
            var data = {
                name: name
            };

            if (e) {
                e.preventDefault();
            }

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'name can\'t be empty'
                });
            }

            model = self.model;
            model.urlRoot = function () {
                return 'scheduledPay';
            };

            model.save(data, {
                patch  : true,
                headers: {
                    mid: 103
                },

                wait   : true,
                success: function () {
                    self.hideDialog();
                    self.eventChannel.trigger('updateScheduledPay');
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({model: self.model.toJSON()});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit ScheduledPay',
                width      : '900px',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        id   : 'create-scheduledPay-dialog',
                        class: 'btn blue',
                        text : 'Save',
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
                    }]

            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return EditView;
});
