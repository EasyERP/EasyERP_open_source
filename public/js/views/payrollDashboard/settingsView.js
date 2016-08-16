define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/payrollDashboard/settingsDashboardTemplate.html'
], function (Backbone, $, _, settingsTemplate) {
    var ContentView = Backbone.View.extend({
        el      : '#settings',
        template: _.template(settingsTemplate),

        events: {},

        initialize: function (options) {
            this.employees = options.employees;
            this.scheduledPay = options.scheduledPay;
            this.weeklyScheduler = options.weeklyScheduler;
            this.payrollStructure = options.payrollStructure;
            this.bankAccounts = options.bankAccounts;

            this.render();
        },

        render: function () {
            this.$el.html(this.template({
                employees       : this.employees,
                scheduledPay    : this.scheduledPay,
                weeklyScheduler : this.weeklyScheduler,
                payrollStructure: this.payrollStructure,
                bankAccounts    : this.bankAccounts
            }));
            
            return this;
        }
    });

    return ContentView;

});