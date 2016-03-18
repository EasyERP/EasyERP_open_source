define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/journalEntry/TopBarTemplate.html',
        'custom',
        'constants',
        'dataService',
        'common',
        'moment'
    ],
    function (Backbone, $, _, ContentTopBarTemplate, Custom, CONSTANTS, dataService, common, moment) {
        'use strict';
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.JOURNALENTRY,
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click #reconcileBtn"               : "reconcile",
                "click #top-bar-exportToCsvBtn"     : "exportToCsv",
                "click #top-bar-exportToXlsxBtn"    : "exportToXlsx",
                "click #updateDate"                 : "changeDateRange",
                "click .dateRange"                  : "toggleDateRange",
                "click #cancelBtn"                  : "cancel",
                "click li.filterValues:not(#custom)": "setDateRange",
                "click #custom"                     : "showDatePickers"
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

                this.removeAllChecked();

                $target.toggleClass('checkedValue');

                switch (id) {
                    case 'thisMonth':
                    {
                        startDate = date.startOf('month');
                        endDate = moment(startDate).endOf('month');
                    }
                        break;
                    case 'thisYear':
                    {
                        startDate = date.startOf('year');
                        endDate = moment(startDate).endOf('year');
                    }
                        break;
                    case 'lastMonth':
                    {
                        startDate = date.subtract(1, 'month').startOf('month');
                        endDate = moment(startDate).endOf('month');
                    }
                        break;
                    case 'lastQuarter':
                    {
                        quarter = date.quarter();

                        startDate = date.quarter(quarter - 1).startOf('quarter');
                        endDate = moment(startDate).endOf('quarter');
                    }
                        break;
                    case 'lastYear':
                    {
                        startDate = date.subtract(1, 'year').startOf('year');
                        endDate = moment(startDate).endOf('year');
                    }
                        break;
                }

                this.$el.find('#startDate').datepicker('setDate', new Date(startDate));
                this.$el.find('#endDate').datepicker('setDate', new Date(endDate));

                this.changeDateRange();
            },

            showDatePickers: function (e) {
                var $target = $(e.target);

                this.removeAllChecked();

                $target.toggleClass('checkedValue');
                this.$el.find('.customTime').toggleClass('hidden');
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

                Custom.cacheToApp('journalEntryDateRange', {
                    startDate: startDate,
                    endDate  : endDate
                });

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
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        defaultDate: startDate,
                        onSelect   : function () {
                            var endDatePicker = self.$endDate;

                            endDatePicker.datepicker('option', 'minDate', $(this).val());

                            return false;
                        }
                    }).datepicker('setDate', startDate);

                this.$endDate = this.$el.find('#endDate')
                    .datepicker({
                        dateFormat : "d M, yy",
                        changeMonth: true,
                        changeYear : true,
                        defaultDate: endDate
                    }).datepicker('setDate', endDate);
            },

            reconcile: function (e) {
                if ($(e.target).hasClass('greenBtn')) {
                    return false;
                }

                var date = this.$el.find('#reconcileDate').text();

                dataService.postData('journal/reconcile', {date: date}, function () {
                    var location = window.location.hash;
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(location, {trigger: true});
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
                var viewType = Custom.getCurrentVT();
                var dateRange = Custom.retriveFromCash('journalEntryDateRange');

                this.startDate = common.utcDateToLocaleDate(dateRange.startDate);
                this.endDate = common.utcDateToLocaleDate(dateRange.endDate);

                $('title').text(this.contentType);

                this.$el.html(this.template({
                    viewType   : viewType,
                    contentType: this.contentType,
                    startDate  : this.startDate,
                    endDate    : this.endDate
                }));

                this.bindDataPickers(this.startDate, this.endDate);

                return this;
            }
        });

        return TopBarView;
    }
)
;
