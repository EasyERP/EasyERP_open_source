define([
        'jQuery',
        'Underscore',
        'Backbone',
        'text!templates/settingsEmployee/list/ListTemplate.html',
        'views/weeklyScheduler/list/ListView'
    ],

    function ($,
              _,
              Backbone,
              listTemplate,
              weeklySchedulerView) {

        var SettingsEmployeeListView = Backbone.View.extend({
            el         : '#content-holder',
            template: _.template(listTemplate),

            initialize: function (options) {
                var self = this;
                var eventChannel = {};

                _.extend(eventChannel, Backbone.Events);
                self.eventChannel = eventChannel;

                this.render();

                self.eventChannel.on('updateWeeklyScheduler', self.getWeeklyScheduler, self);
            },

            getWeeklyScheduler: function () {
                var self = this;

                if (self.weeklySchedulerView) {
                    self.weeklySchedulerView.undelegateEvents();
                }

                self.weeklySchedulerView = new weeklySchedulerView({eventChannel: self.eventChannel});
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(self.template());

                self.getWeeklyScheduler();

            }

        });

        return SettingsEmployeeListView;
    });
