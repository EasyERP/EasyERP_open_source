define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/weeklyScheduler/EditTemplate.html'
], function ($, _, Backbone, CreateTemplate) {

    var EditView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'weeklyScheduler',
        template   : _.template(CreateTemplate),

        events: {
            'keyup td[data-type="input"]': 'recalcTotal'
        },

        initialize: function (options) {
            var self = this;

            self.model = options.model;
            self.eventChannel = options.eventChannel;

            self.render();
        },

        recalcTotal: function (e) {
            var self = this;
            var totalHours = 0;
            var $currentEl = this.$el;
            var hours;
            var i;

            e.preventDefault();

            for (i = 7; i > 0; i--) {
                hours = parseInt($currentEl.find('td[data-content="' + i + '"] input').val(), 10);
                totalHours += isNaN(hours) ? 0 : hours;
            }

            $currentEl.find('#totalHours span').text(totalHours);
        },

        saveItem: function () {
            var self = this;
            var model;
            var hours;
            var $currentEl = this.$el;
            var name = $.trim($currentEl.find('#weeklySchedulerName input').val());
            var totalHours = $currentEl.find('#totalHours span').text();
            var data = {
                name      : name,
                totalHours: totalHours
            };
            var i;

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'name can\'t be empty'
                });
            }

            for (i = 7; i > 0; i--) {
                hours = parseInt($currentEl.find('td[data-content="' + i + '"] input').val(), 10);
                hours = isNaN(hours) ? 0 : hours;

                if (hours < 0 || hours > 24) {
                    return App.render({
                        type   : 'error',
                        message: 'hours should be in 0-24 range'
                    });
                }

                data[i] = hours;
            }

            model = self.model;
            model.urlRoot = function () {
                return 'weeklyScheduler';
            };

            model.save(data, {
                patch  : true,
                headers: {
                    mid: 103
                },

                wait   : true,
                success: function () {
                    self.hideDialog();
                    self.eventChannel.trigger('updateWeeklyScheduler');
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
                title      : 'Create WeeklyScheduler',
                width      : '900px',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        id   : 'create-weeklyScheduler-dialog',
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
