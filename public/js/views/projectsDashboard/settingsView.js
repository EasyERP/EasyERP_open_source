define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/projectsDashboard/settingsDashboardTemplate.html'
], function (Backbone, $, _, settingsTemplate) {
    var ContentView = Backbone.View.extend({
        el      : '#settings',
        template: _.template(settingsTemplate),

        events: {
            'click .closePayrollList': 'closeSettings',
            'click ._payrollListItem': 'redirectTo'
        },

        initialize: function (options) {
            this.employees = options.employees;
            this.scheduledPay = options.scheduledPay;
            this.weeklyScheduler = options.weeklyScheduler;
            this.payrollStructure = options.payrollStructure;
            this.bankAccounts = options.bankAccounts;

            this.render();
        },

        closeSettings: function () {
            this.$el.hide();
            $('.backToSettings').show();
        },

        redirectTo: function (e) {
            var $target = $(e.target);
            var a = $target.find('._payrollListAction');
            var href = a.attr('href');

            Backbone.history.navigate(href, {trigger: true});
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