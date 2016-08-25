define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/projectsDashboard/settingsView',
    'text!templates/projectsDashboard/DashboardTemplate.html',
    'text!templates/projectsDashboard/settingsDashboardTemplate.html',
    'async',
    'dataService',
    'helpers'
], function (Backbone, $, _, SettingsView, contentTemplate, settingsTemplate, async, dataService, helpers) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',

        events: {
            'click .mainTr': 'showHidden'
        },

        initialize: function () {
            var self = this;

            dataService.getData('jobs/getForProjectsDashboard', {}, function (response) {
                if (response.error) {
                    return self.render();
                }

                self.dataByPMS = response.data;

                self.render();
            });
            // this.getParallelResults();
        },

        showHidden: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var dataId = $tr.attr('data-id');
            var $body = this.$el;
            var childTr = $body.find('[data-main="' + dataId + '"]');
            var sign = $.trim($tr.find('.expand').text());

            if (sign === '+') {
                $tr.find('.expand').text('-');
            } else {
                $tr.find('.expand').text('+');
            }

            childTr.toggleClass();
        },

        asyncRenderInfo: function (asyncKeys) {
            var self = this;
            var body = this.$el.find('#pmsBody');
            var total = 0;

            async.each(asyncKeys, function (asyncId, cb) {
                dataService.getData('jobs/getAsyncData', {
                    _id: asyncId
                }, function (result) {
                    var items = result.data;
                    var totalSum = 0;
                    var mainTr = body.find('[data-id="' + asyncId + '"]');

                    if (!asyncId) {
                        mainTr = body.find('[data-id="null"]');
                    }
                    items.forEach(function (el) {
                        totalSum += el.quotation ? el.quotation.paymentInfo.total / el.quotation.currency.rate : 0;
                        mainTr.after("<tr data-main='" + asyncId + "' class='hidden'><td><a href='" + '#easyErp/Projects/form/' + el.project._id + "'>" + el.project.name + "</a></td><td>" + (el.customer ? el.customer.name : '') + "</td><td>" + el.name + "</td><td class='money'>" + (el.quotation ? helpers.currencySplitter((el.quotation.paymentInfo.total / el.quotation.currency.rate / 100).toFixed(2)) : 0) + "</td></tr>");
                    });

                    mainTr.find('.sum').text(helpers.currencySplitter((totalSum / 100).toFixed(2)));

                    total += totalSum;

                    cb(null, result);
                });

            }, function () {
                self.$el.find('#totalSum').text(helpers.currencySplitter((total / 100).toFixed(2)));
            });
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

        /* getParallelResults: function () {
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
         },*/

        render: function () {
            var template = _.template(contentTemplate);
            var asyncKeys = [];

            this.dataByPMS.forEach(function (el) {
                asyncKeys.push(el._id._id || null);
            });

            this.$el.html(template({
                collection      : this.dataByPMS,
                currencySplitter: helpers.currencySplitter
            }));

            this.asyncRenderInfo(asyncKeys);
        }
    });

    return ContentView;
});