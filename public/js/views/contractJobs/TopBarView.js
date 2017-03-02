define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'views/Filter/dateFilter',
    'text!templates/contractJobs/TopBarTemplate.html',
    'custom',
    'common',
    'moment'
], function ($, _, BaseView, DateFilterView, ContentTopBarTemplate, Custom, common, moment) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : 'contractJobs',
        contentHeader: 'Contract Jobs',
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render();
        },

        events: {
            // 'click #updateDate'                 : 'changeDateRange',
            // 'click .dateRange'                  : 'toggleDateRange',
            // 'click #cancelBtn'                  : 'cancel',
            // 'click li.filterValues:not(#custom)': 'setDateRange',
            // 'click #custom'                     : 'showDatePickers'
        },

        removeAllChecked: function () {
            var filter = this.$el.find('ul.dateFilter');
            var li = filter.find('li');

            li.removeClass('checkedValue');
        },

        cancel: function (e) {
            var targetEl = $(e.target);
            var ul = targetEl.closest('ul.frameDetail');

            ul.addClass('hidden');
        },

        setDateRange: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var date = moment(new Date());
            var quarter;

            var startDate;
            var endDate;

            this.$el.find('.customTime').addClass('hidden');
            this.$el.find('.buttons').addClass('hidden');

            this.removeAllChecked();

            if ($target.text() !== 'Custom Dates') {
                $target.toggleClass('checkedValue');
            } else {
                $target.toggleClass('checkedArrow');
            }

            // $target.toggleClass('checkedValue');

            switch (id) {
                case 'thisMonth':
                    startDate = date.startOf('month');
                    endDate = moment(startDate).endOf('month');
                    break;
                case 'thisYear':
                    startDate = date.startOf('year');
                    endDate = moment(startDate).endOf('year');
                    break;
                case 'lastMonth':
                    startDate = date.subtract(1, 'month').startOf('month');
                    endDate = moment(startDate).endOf('month');
                    break;
                case 'lastQuarter':
                    quarter = date.quarter();

                    startDate = date.quarter(quarter - 1).startOf('quarter');
                    endDate = moment(startDate).endOf('quarter');
                    break;
                case 'lastYear':
                    startDate = date.subtract(1, 'year').startOf('year');
                    endDate = moment(startDate).endOf('year');
                    break;
                // skip default;
            }

            this.$el.find('#startDate').datepicker('setDate', new Date(startDate));
            this.$el.find('#endDate').datepicker('setDate', new Date(endDate));

            this.changeDateRange();
        },

        showDatePickers: function (e) {
            var $target = $(e.target);

            this.removeAllChecked();

            if ($target.text() !== 'Custom Dates') {
                $target.toggleClass('checkedValue');
            } else {
                $target.toggleClass('checkedArrow');
            }
            // $target.toggleClass('checkedValue');
            this.$el.find('.customTime').toggleClass('hidden');
            this.$el.find('.buttons').toggleClass('hidden');
        },

        changeDateRange: function (e) {
            var dateFilter = e ? $(e.target).closest('ul.dateFilter') : this.$el.find('ul.dateFilter');
            var startDate = dateFilter.find('#startDate');
            var endDate = dateFilter.find('#endDate');
            var startTime = dateFilter.find('#startTime');
            var endTime = dateFilter.find('#endTime');

            startDate = startDate.val();
            endDate = endDate.val();

            startTime.text(startDate);
            endTime.text(endDate);

            this.trigger('changeDateRange');

            this.toggleDateRange();
        },

        toggleDateRange: function (e) {
            var ul = e ? $(e.target).closest('ul') : this.$el.find('.dateFilter');

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
                        var endDatePicker = self.$endDate;
                        var endDate;

                        endDatePicker.datepicker('option', 'minDate', $(this).val());

                        endDate = moment(new Date($(this).val())).endOf('month');
                        endDate = new Date(endDate);

                        endDatePicker.datepicker('setDate', endDate);

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

        render: function () {
            var self = this;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('contractJobs.filter');
            var dateRange = filter && filter.date ? filter.date.value : [];

            $('title').text(this.contentHeader);

            this.startDate = common.utcDateToLocaleDate(new Date(dateRange[0]));
            this.endDate = common.utcDateToLocaleDate(new Date(dateRange[1]));

            this.$el.html(this.template({
                viewType   : viewType,
                contentType: this.contentType,
                startDate  : this.startDate,
                endDate    : this.endDate
            }));

            this.cotractsJobsDateFilterView = new DateFilterView({
                contentType: 'contractJobs',
                el         : this.$el.find('#contractJobsDateFilter')
            });

            this.cotractsJobsDateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.cotractsJobsDateFilterView.dateArray);
            });

            this.cotractsJobsDateFilterView.checkElement('custom', [
                moment(this.collection.startDate).format('D MMM, YYYY'),
                moment(this.collection.endDate).format('D MMM, YYYY')
            ]);

            // this.bindDataPickers(this.startDate, this.endDate);

            return this;
        }
    });

    return TopBarView;
});
