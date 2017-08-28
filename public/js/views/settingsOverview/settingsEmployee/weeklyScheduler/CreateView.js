define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/settingsOverview/settingsEmployee/weeklyScheduler/CreateTemplate.html',
    'models/WeeklySchedulerModel',
    'helpers/ga'
], function ($, _, Backbone, CreateTemplate, WeeklySchedulerModel, ga) {

    var CreateView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'weeklyScheduler',
        template   : _.template(CreateTemplate),

        events: {
            'keyup td[data-type="input"]': 'recalcTotal'
        },

        initialize: function (options) {
            var self = this;

            self.collection = options.collection;

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
            var i;
            var name = $.trim($currentEl.find('#weeklySchedulerName input').val());
            var totalHours = $currentEl.find('#totalHours span').text();

            var data = {
                name      : name,
                totalHours: totalHours
            };

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'Name can\'t be empty'
                });
            }

            for (i = 7; i > 0; i--) {
                hours = parseInt($currentEl.find('td[data-content="' + i + '"] input').val(), 10);
                hours = isNaN(hours) ? 0 : hours;

                if (hours < 0 || hours > 24) {
                    return App.render({
                        type   : 'error',
                        message: 'Hours should be in 0-24 range'
                    });
                }

                data[i] = hours;
            }

            model = new WeeklySchedulerModel();
            model.urlRoot = function () {
                return 'weeklyScheduler';
            };

            model.save(data, {
                patch  : true,
                headers: {
                    mid: 103
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
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        render: function () {
            var formString = this.template();
            var self = this;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create WeeklyScheduler',
                width      : '900px',
                position   : {within: $('#wrapper')},
                buttons    : [{
                    id   : 'create-weeklyScheduler-dialog',
                    class: 'btn blue',
                    text : 'Create',
                    click: function () {
                        self.saveItem();
                        ga && ga.trackingEditConfirm(self.contentType);
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                        ga && ga.trackingEditCancel(self.contentType);
                    }
                }]
            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
