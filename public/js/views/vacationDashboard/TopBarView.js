define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Filter/dateFilter',
    'text!templates/vacationDashboard/TopBarTemplate.html',
    'moment',
    'custom'
], function (Backbone, $, _, DateFilterView, ContentTopBarTemplate, moment, custom) {
    'use strict';
    var TopBarView = Backbone.View.extend({
        el           : '#top-bar',
        contentType  : 'DashBoardVacation',
        contentHeader: 'Planning',
        template     : _.template(ContentTopBarTemplate),

        events: {
            /* 'click #updateDate': 'changeDateRange',
             'click .dateRange' : 'toggleDateRange',
             'click #cancelBtn' : 'cancel' */
        },

        initialize: function (options) {
            if (options && options.collection) {
                this.collection = options.collection;
            }

            this.render();
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

         /!* custom.cacheToApp('vacationDashDateRange', {}); *!/

         this.trigger('changeDateRange', [startDate, endDate]);
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
         var endDateVal = moment(targetInput.datepicker('getDate'));

         endDateVal.add(CONSTANTS.DASH_VAC_RANGE_WEEKS_MIN, 'week').day('Monday');
         endDateVal = endDateVal.toDate();

         endDatePicker.datepicker('option', 'minDate', endDateVal);

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
         },

         hideDateRange: function () {
         var targetEl = this.$el.find('.frameDetail');

         targetEl.addClass('hidden');
         }, */


        render: function () {
            var self = this;
            var dateRange;
            var viewType = custom.getCurrentVT();
            var filter = custom.retriveFromCash('DashVacation.filter');

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

            if (viewType && viewType === 'tform') {
                this.$el.addClass('position');
            } else {
                this.$el.removeClass('position');
            }

            this.$el.html(this.template({
                contentType: this.contentHeader
            }));

            this.dateFilterView = new DateFilterView({
                contentType: 'DashVacation',
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
