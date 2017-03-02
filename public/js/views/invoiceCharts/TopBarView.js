define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/Filter/dateFilter',
    'text!templates/invoiceCharts/TopBarTemplate.html',
    'moment',
    'custom'
], function (Backbone, _, $, DateFilterView, ContentTopBarTemplate, moment, custom) {
    'use strict';
    var TopBarView = Backbone.View.extend({
        el           : '#top-bar',
        contentType  : 'InvoiceCharts',
        contentHeader: 'Invoice Charts',
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
         var $targetEl = $(e.target);
         var $dateFilterEl = $targetEl.closest('ul.dateFilter');
         var $startDateEl = $dateFilterEl.find('#startDate');
         var $endDateEl = $dateFilterEl.find('#endDate');
         var $startTimeEl = $dateFilterEl.find('#startTime');
         var $endTimeEl = $dateFilterEl.find('#endTime');
         var startDateText;
         var endDateText;

         var startDate;
         var endDate;

         startDateText = $startDateEl.val();
         endDateText = $endDateEl.val();

         startDate = new Date(startDateText);
         endDate = new Date(endDateText);

         if (startDate <= endDate) {
         $startTimeEl.text(startDateText);
         $endTimeEl.text(endDateText);

         this.trigger('changeDateRange', [startDate, endDate]);
         this.toggleDateRange(e);
         } else {
         App.render({
         message: 'Value of field "End date" can`t be less then value of field "StartDate"!'
         });
         }

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

         endDateVal.add(6, 'week').day('Monday');
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
         }, */

        render: function () {
            /* var startDate = moment([2014, 7]).format('DD MMM, YYYY');
             var endDate = moment().format('DD MMM, YYYY'); */
            var self = this;
            var dateRange;
            var filter = custom.retriveFromCash('invoiceCharts.filter');

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

            this.$el.html(this.template({
                contentType: this.contentType
            }));

            this.dateFilterView = new DateFilterView({
                contentType: 'invoiceCharts',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [startDate, endDate]);

            /* this.bindDataPickers(startDate, endDate); */

            return this;
        }
    });

    return TopBarView;
});
