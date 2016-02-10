/**
 * Created by German on 03.07.2015.
 */
define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/hrDashboard/index.html',
    'collections/Dashboard/hrDashboard',
    'constants',
    'custom',
    'moment'
], function (Backbone, $, _, mainTemplate, HrDashboard, CONSTANTS, custom, moment) {
    'use strict';

    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.DASHBOARD_HR,

        template: _.template(mainTemplate),

        events: {},

        initialize: function (options) {
            var dashCollection = this.dashCollection = custom.retriveFromCash('hrDashboard');

            this.startTime = options.startTime;

            if (!dashCollection) {
                dashCollection = this.dashCollection = new HrDashboard();
                dashCollection.on('reset sort', this.render, this);

                custom.cacheToApp('hrDashboard', dashCollection);
            } else {
                this.render();
            }
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            $('title').text(this.contentType);

            var start = moment().subtract(11, 'month').date(1);
            var startMonth = start.month() + 1;
            var startYear = start.isoWeekYear();
            var i;
            var arrOfDates = custom.retriveFromCash('arrOfDates') || [];
            var month;
            var year;
            var hired = this.dashCollection.get('hired');
            var fired = this.dashCollection.get('fired');

            if (!arrOfDates || !arrOfDates.length) {
                for (i = 0; i < 12; i++) {
                    month = startMonth + i;

                    if (month > 12) {
                        year = startYear + 1;
                        month -= 12;
                    } else {
                        year = startYear;
                    }

                    arrOfDates.push({
                        month      : month,
                        year       : year,
                        dateByMonth: year * 100 + month
                    });
                }

                custom.cacheToApp('arrOfDates', arrOfDates);
            }

            $currentEl.html(this.template({arrOfDates: arrOfDates, hired: hired, fired: fired}));

            arrOfDates.forEach(function (dateObject) {
                var totalContainer = self.$el.find('#total_' + dateObject.dateByMonth);
                var hiredContainer = self.$el.find('#hired_' + dateObject.dateByMonth);
                var firedContainer = self.$el.find('#fired_' + dateObject.dateByMonth);

                totalContainer.text(parseInt(hiredContainer.text(), 10) - parseInt(firedContainer.text(), 10));
            });

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            return this;
        }
    });

    return View;
});