define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/payrollDashboard/settingsView',
    'text!templates/payrollDashboard/DashboardTemplate.html',
    'text!templates/payrollDashboard/settingsDashboardTemplate.html',
    'async',
    'dataService'
], function (Backbone, $, _, SettingsView, contentTemplate, settingsTemplate, async, dataService) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function () {
            this.render();
            this.getParallelResults();
        },

        backToSettings: function () {
            var settings = this.$el.find('#settings');

            $('.backToSettings').hide();

            if (settings && settings.length) {
                return settings.show();
            }

            this.$el.html('<div id="settings" class="_payrollListWrapOuter"></div>');

            new SettingsView(this.results);
        },

        getParallelResults: function () {
            var self = this;

            function getScheduledPay(pCb) {
                dataService.getData('scheduledPay/forDd', {}, function (response) {
                    if (response.error) {
                        return pCb(response.error);
                    }

                    pCb(null, response.data);
                });
            }

            function getWeeklyScheduler(pCb) {
                dataService.getData('weeklyScheduler/forDd', {}, function (response) {
                    if (response.error) {
                        return pCb(response.error);
                    }

                    pCb(null, response.data);
                });
            }

            function getPayrollStructure(pCb) {
                dataService.getData('payrollStructureTypes/forDd', {}, function (response) {
                    if (response.error) {
                        return pCb(response.error);
                    }

                    pCb(null, response.data);
                });
            }

            function getBankAccount(pCb) {
                dataService.getData('paymentMethod/', {}, function (response) {
                    if (response.error) {
                        return pCb(response.error);
                    }

                    pCb(null, response.data);
                });
            }

            function getEmployees(pCb) {
                dataService.getData('employees/getForDD', {}, function (response) {
                    if (response.error) {
                        return pCb(response.error);
                    }

                    pCb(null, response.data);
                });
            }

            async.parallel({
                scheduledPay    : getScheduledPay,
                weeklyScheduler : getWeeklyScheduler,
                payrollStructure: getPayrollStructure,
                bankAccounts    : getBankAccount,
                employees       : getEmployees
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                self.results = result;

                if (!result.scheduledPay.length || !result.weeklyScheduler.length || !result.bankAccounts || !result.employees.length || !result.payrollStructure.length) {
                    self.$el.html('<div id="settings" class="_payrollListWrapOuter"></div>');

                    new SettingsView(result);

                    $('.backToSettings').hide();
                }

            });
        },

        render: function () {

        }
    });

    return ContentView;
});