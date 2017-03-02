define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/settingsOverview/settingsEmployee/TabsTemplate.html',
    'collections/weeklyScheduler/filterCollection',
    'collections/scheduledPay/filterCollection',
    'views/settingsOverview/settingsEmployee/weeklyScheduler/ListView',
    'views/settingsOverview/settingsEmployee/scheduledPay/ListView',
    'views/settingsOverview/settingsEmployee/employeeProfileSettings/Index',
    'views/settingsOverview/settingsEmployee/payrollComponentTypes/ListView',
    'views/settingsOverview/settingsEmployee/payrollStructureTypes/ListView'
], function ($,
             _,
             Backbone,
             Parent,
             TabsTemplate,
             WeeklySchedulerCollection,
             ScheduledPayCollection,
             WeeklySchedulerView,
             ScheduledPayView,
             DefaultProfileViewView,
             PayrollComponentTypeView,
             PayrollStructureView) {

    var SettingsEmployeeListView = Parent.extend({
        el      : '#content-holder',
        template: _.template(TabsTemplate),

        initialize: function (options) {
            this.startTime = options.startTime;
            this.weeklySchedulerCollection = new WeeklySchedulerCollection({});
            this.scheduledPayCollection = new ScheduledPayCollection({});

            this.weeklySchedulerCollection.bind('reset', this.renderWeeklyScheduler, this);
            this.scheduledPayCollection.bind('reset', this.renderScheduledPay, this);

            this.render();

            this.renderDefaultProfile();
            this.getPayrollEarningsType();
            this.getPayrollDeductionsType();
            this.getPayrollStructure();

            $('#top-bar').html('');
        },

        getPayrollEarningsType: function () {
            var self = this;

            if (self.payrollEarningsType) {
                self.payrollEarningsType.undelegateEvents();
            }

            self.payrollEarningsType = new PayrollComponentTypeView({
                type: 'earnings',
                el  : '#payrollEarningsTab'
            });
        },

        getPayrollStructure: function () {
            var self = this;

            if (self.payrollStructure) {
                self.payrollStructure.undelegateEvents();
            }

            self.payrollStructure = new PayrollStructureView({
                el: '#payrollStructureTab'
            });
        },

        getPayrollDeductionsType: function () {
            var self = this;

            if (self.payrollDeductionsType) {
                self.payrollDeductionsType.undelegateEvents();
            }

            self.payrollDeductionsType = new PayrollComponentTypeView({
                type: 'deductions',
                el  : '#payrollDeductionsTab'
            });
        },

        renderWeeklyScheduler: function () {
            new WeeklySchedulerView({
                collection: this.weeklySchedulerCollection
            }).render();
        },

        renderDefaultProfile: function () {
            new DefaultProfileViewView({});
        },

        renderScheduledPay: function () {
            new ScheduledPayView({
                collection: this.scheduledPayCollection
            }).render();
        },

        render: function () {
            var formString = this.template();

            this.$el.html(formString);

            return this;
        }

    });

    return SettingsEmployeeListView;
});
