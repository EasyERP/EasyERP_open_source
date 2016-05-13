define([
        'jQuery',
        'Underscore',
        'Backbone',
        'text!templates/settingsEmployee/list/ListTemplate.html',
        'views/weeklyScheduler/list/ListView',
        'views/payrollComponentTypes/list/ListView'
    ],

    function ($,
              _,
              Backbone,
              listTemplate,
              weeklySchedulerView,
              PayrollComponentTypeView) {

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
                self.eventChannel.on('updatePayrollDeductionsType', self.getPayrollDeductionsType, self);
                self.eventChannel.on('updatePayrollEarningsType', self.getPayrollEarningsType, self);
            },

            getWeeklyScheduler: function () {
                var self = this;

                if (self.weeklySchedulerView) {
                    self.weeklySchedulerView.undelegateEvents();
                }

                self.weeklySchedulerView = new weeklySchedulerView({eventChannel: self.eventChannel});
            },

            getPayrollEarningsType: function () {
                var self = this;

                if (self.payrollEarningsType) {
                    self.payrollEarningsType.undelegateEvents();
                }

                self.payrollEarningsType = new PayrollComponentTypeView({
                    eventChannel: self.eventChannel,
                    type: 'earnings',
                    el: '#earningType'
                });
            },

            getPayrollDeductionsType: function () {
                var self = this;

                if (self.payrollDeductionsType) {
                    self.payrollDeductionsType.undelegateEvents();
                }

                self.payrollDeductionsType = new PayrollComponentTypeView({
                    eventChannel: self.eventChannel,
                    type: 'deductions',
                    el: '#deductionType'
                });
            },

            render: function () {
                var self = this;
                var $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(self.template());

                self.getWeeklyScheduler();
                self.getPayrollEarningsType();
                self.getPayrollDeductionsType();

            }

        });

        return SettingsEmployeeListView;
    });
