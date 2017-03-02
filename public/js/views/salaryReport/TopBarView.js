define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Filter/dateFilter',
    'text!templates/salaryReport/TopBarTemplate.html',
    'custom',
    'constants',
    'common',
    'moment'
], function (Backbone, $, _, DateFilterView, ContentTopBarTemplate, Custom, CONSTANTS, common, moment) {
    'use strict';

    var TopBarView = Backbone.View.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.SALARYREPORT,
        contentHeader: 'Salary Report',
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render();
        },

        events: {
            /* 'click #updateDate': 'changeDateRange',
             'click .dateRange' : 'toggleDateRange',
             'click #cancelBtn' : 'cancel' */
        },

        /* cancel: function (e) {
         var targetEl = $(e.target);
         var ul = targetEl.closest('ul.frameDetail');

         ul.addClass('hidden');
         },

         changeDateRange: function (e) {
         var targetEl = $(e.target);
         var dateFilter = targetEl.closest('ul.dateFilter');
         var startDate = dateFilter.find('#startDate');
         var endDate = dateFilter.find('#endDate');
         var startTime = dateFilter.find('#startTime');
         var endTime = dateFilter.find('#endTime');

         startDate = startDate.val();
         endDate = endDate.val();

         startTime.text(startDate);
         endTime.text(endDate);

         Custom.cacheToApp('salaryReportDateRange', {
         startDate: startDate,
         endDate  : endDate
         });

         this.trigger('changeDateRange');
         this.toggleDateRange(e);
         },

         toggleDateRange: function (e) {
         var targetEl = $(e.target);
         var ul = targetEl.closest('ul');

         if (!ul.hasClass('frameDetail')) {
         ul.find('.frameDetail').toggleClass('hidden');
         } else {
         ul.toggleClass('hidden');
         }
         },

         hideDateRange: function () {
         var targetEl = this.$el.find('.frameDetail');

         targetEl.addClass('hidden');
         },

         bindDataPickers: function (startDate, endDate) {
         var self = this;

         this.$el.find('#startDate')
         .datepicker({
         dateFormat : 'd M, yy',
         changeMonth: true,
         changeYear : true,
         defaultDate: startDate,
         onSelect   : function () {
         var targetInput = $(this);
         var endDatePicker = self.$endDate;
         var endD = moment(targetInput.datepicker('getDate'));

         endD.add(1, 'month').day('Monday');
         endD = endD.toDate();

         endDatePicker.datepicker('option', 'minDate', endD);

         return false;
         }
         })
         .datepicker('setDate', startDate);
         this.$endDate = this.$el.find('#endDate')
         .datepicker({
         dateFormat : 'd M, yy',
         changeMonth: true,
         changeYear : true,
         defaultDate: endDate
         })
         .datepicker('setDate', endDate);
         }, */

        render: function () {
            var self = this;
            var dateRange;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('salaryReport.filter');

            var startDate;
            var endDate;

            if (!this.collection) {
                dateRange = filter && filter.date ? filter.date.value : [];

                startDate = new Date(dateRange[0]);
                endDate = new Date(dateRange[1]);
            } else {
                startDate = this.collection.startDate;
                endDate = this.collection.endDate;
            }

            startDate = moment(startDate).format('D MMM, YYYY');
            endDate = moment(endDate).format('D MMM, YYYY');

            $('title').text(this.contentHeader);

            /* this.startDate = common.utcDateToLocaleDate(dateRange.startDate);
            this.endDate = common.utcDateToLocaleDate(dateRange.endDate); */

            this.$el.html(this.template({
                viewType   : viewType,
                contentType: this.contentType
            }));

            /* this.bindDataPickers(this.startDate, this.endDate); */

            this.dateFilterView = new DateFilterView({
                contentType: 'salaryReport',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [startDate, endDate]);

            return this;
        }
    });

    return TopBarView;
});
