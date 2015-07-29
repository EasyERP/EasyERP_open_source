/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/hrDashboard/index.html',
    'collections/Dashboard/hrDashboard',
    'dataService',
    'constants',
    'async',
    'custom',
    'moment'
], function (mainTemplate, hrDashboard, dataService, CONSTANTS, async, custom, moment) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.DASHBOARD_HR,

        template: _.template(mainTemplate),

        events: {

        },

        initialize: function (options) {
            var dashCollection = this.dashCollection = custom.retriveFromCash('hrDashboard');

            this.startTime = options.startTime;

            if (!dashCollection) {
                dashCollection = this.dashCollection = new hrDashboard();
                dashCollection.on('reset sort', this.render, this);

                custom.cashToApp('hrDashboard', dashCollection);
            } else {
                this.render();
            }
        },

        render: function () {
            var self = this;
            var currentEl = this.$el;

            var start = moment().subtract(11, 'month').date(1);
            var startMonth = start.month() + 1;
            var startYear = start.isoWeekYear();

            var arrOfDates = custom.retriveFromCash('arrOfDates') || [];
            var month;
            var year;
            var hired = this.dashCollection.get('hired');
            var fired = this.dashCollection.get('fired');

            if(!arrOfDates || !arrOfDates.length) {
                for (var i = 0; i < 12; i++) {
                    month = startMonth + i;

                    if (month > 12) {
                        year = startYear + 1;
                        month -= 12;
                    } else {
                        year = startYear;
                    }

                    arrOfDates.push({
                        month: month,
                        year: year,
                        dateByMonth: year * 100 + month
                    });
                }

                custom.cashToApp('arrOfDates', arrOfDates);
            }

            currentEl.html(this.template({arrOfDates: arrOfDates, hired: hired, fired: fired}));

            arrOfDates.forEach(function(dateObject){
                var totalContainer = self.$el.find('#total_' + dateObject.dateByMonth);
                var hiredContainer = self.$el.find('#hired_' + dateObject.dateByMonth);
                var firedContainer = self.$el.find('#fired_' + dateObject.dateByMonth);

                totalContainer.text(parseInt(hiredContainer.text()) - parseInt(firedContainer.text()));
            });

            currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            return this;
        }
    });

    return View;
});