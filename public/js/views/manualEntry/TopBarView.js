define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Filter/dateFilter',
    'text!templates/manualEntry/TopBarTemplate.html',
    'custom',
    'constants',
    'dataService',
    'common',
    'moment'
], function (Backbone, $, _, DateFilterView, ContentTopBarTemplate, Custom, CONSTANTS, dataService, common, moment) {
    'use strict';
    var TopBarView = Backbone.View.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.MANUALENTRY,
        contentHeader: 'Manual Entry',
        template     : _.template(ContentTopBarTemplate),

        events: {
            'click #reconcileBtn'               : 'reconcile',
            'click #top-bar-exportToCsvBtn'     : 'exportToCsv',
            'click #top-bar-exportToXlsxBtn'    : 'exportToXlsx',
            /*'click #updateDate'                 : 'changeDateRange',
            'click .dateRange'                  : 'toggleDateRange',
            */'click #top-bar-deleteBtn'          : 'onDeleteEvent',
            /*'click #cancelBtn'                  : 'cancel',
            'click li.filterValues:not(#custom)': 'setDateRange',
            'click #custom'                     : 'showDatePickers',
            */'click #top-bar-createBtn'          : 'onCreateEvent'
        },

        onCreateEvent: function (event) {
            event.preventDefault();
            this.trigger('createEvent');
        },

        onDeleteEvent: function (event) {
            event.preventDefault();

            this.trigger('deleteEvent');
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

            if ($target.text() !== "Custom Dates") {
                $target.toggleClass('checkedValue');
            } else {
                $target.toggleClass('checkedArrow')
            }
            //$target.toggleClass('checkedValue');

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
            }

            this.$el.find('#startDate').datepicker('setDate', new Date(startDate));
            this.$el.find('#endDate').datepicker('setDate', new Date(endDate));

            this.changeDateRange();
        },

        showDatePickers: function (e) {
            var $target = $(e.target);

            this.removeAllChecked();

            if ($target.text() !== "Custom Dates") {
                $target.toggleClass('checkedValue');
            } else {
                $target.toggleClass('checkedArrow')
            }

            //$target.toggleClass('checkedValue');
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
                }).datepicker('setDate', startDate);

            this.$endDate = this.$el.find('#endDate')
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: endDate
                }).datepicker('setDate', endDate);
        },

        reconcile: function (e) {
            var date;

            if ($(e.target).hasClass('greenBtn')) {
                return false;
            }

            date = this.$el.find('#reconcileDate').text();

            dataService.postData('journalEntries/reconcile', {date: date}, function () {
                App.render({
                    type   : 'notify',
                    message: 'Your request has been sent for processing. Please, wait few minutes.'
                });
            });
        },

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render();
        },

        exportToCsv: function (event) {
            event.preventDefault();
            this.trigger('exportToCsv');
        },

        exportToXlsx: function (event) {
            event.preventDefault();
            this.trigger('exportToXlsx');
        },

        render: function () {
            var self = this;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('manualEntry.filter');
            var dateRange;
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

            /*this.startDate = common.utcDateToLocaleDate(new Date(dateRange[0]));
            this.endDate = common.utcDateToLocaleDate(new Date(dateRange[1]));*/

            $('title').text(this.contentHeader || this.contentType);

            this.$el.html(this.template({
                viewType   : viewType,
                contentType: this.contentType
            }));

            this.dateFilterView = new DateFilterView({
                contentType: 'manualEntry',
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

