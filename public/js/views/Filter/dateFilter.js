define([
    'Backbone',
    'Underscore',
    'jQuery',
    'moment',
    'text!templates/Filter/datesFilters/dateFilter.html',
    'text!templates/Filter/datesFilters/rangeFilter.html',
    'helpers/getDateHelper',
    'constants/filterDateNames',
    'constants/filters',
    'helpers'
], function (Backbone, _, $, moment, DateFilterTemplate, RangeFilterTemplate, getDateHelper, FILTER_DATE_NAMES, FILTERS, helpers) {
    'use strict';
    var DateView = Backbone.View.extend({
        dateTemplate : _.template(DateFilterTemplate),
        rangeTemplate: _.template(RangeFilterTemplate),

        events: {
            'click .updateBtn'   : 'updateValues',
            'click .filterValues': 'checkElement',
            'click .cancelBtn'   : 'toggleDateRange',
            'click .dateRange'   : 'toggleDateRange'
        },

        initialize: function (options) {
            var _opts = options || {};
            var collectionElementsArray;
            var filtersObject;

            this.contentType = _opts.contentType;
            this.type = _opts.type || 'date';

            filtersObject = FILTERS[this.contentType] || {};

            collectionElementsArray = filtersObject[this.type + 'FilterArray'] || [];

            this.onlyCustom = collectionElementsArray.length && collectionElementsArray.length === 1 && collectionElementsArray[0] === 'custom';

            this.onlyEndDate = collectionElementsArray.length && collectionElementsArray.length === 1 && collectionElementsArray[0] === 'endDate';
            this.collection = _.compact(_.map(collectionElementsArray, function (element) {
                var elementObject = FILTER_DATE_NAMES[element];

                if (elementObject) {
                    elementObject.key = element;
                }

                return elementObject;
            }));

            this.render();
        },

        /* update: function (e){
         e.stopPropagation();
         e.preventDefault();

         this.updateValues(arguments[1]);
         },*/

        toggleDateRange: function (e) {
            var $curTarget = $(e.currentTarget).closest('.dateFilter');
            var $ul = $curTarget.find('.frameDetail');

            e.preventDefault();

            $ul.toggleClass('hidden');
        },

        updateValues: function (valuesObject) {
            var valueStart;
            var valueEnd;

            if (this.type === 'date') {
                if (valuesObject && valuesObject.length) {
                    valueStart = helpers.setTimeToDate(valuesObject[0]);
                    valueEnd = helpers.setTimeToDate(valuesObject[1]);
                } else {
                    valueStart = this.$el.find('#startDate' + this.contentType).val();
                    valueEnd = this.$el.find('#endDate' + this.contentType).val();

                    valuesObject.preventDefault();

                    this.toggleDateRange(valuesObject);
                }

                if (valueEnd || valueStart) {

                    if (!valueStart){
                        valueStart = moment(new Date(valueEnd)).startOf('month');
                    }
                    this.startDateSpan.text(moment(valueStart).format('DD, MMM YYYY'));
                    this.endDateSpan.text(moment(valueEnd).format('DD, MMM YYYY'));

                    valueStart = helpers.setTimeToDate(new Date(valueStart));
                    valueEnd = helpers.setTimeToDate(new Date(valueEnd));

                    this.dateArray = [valueStart, valueEnd];

                    this.bindDatePickers(this.dateArray);
                }
            } else {
                valueStart = helpers.setTimeToDate(new Date(valuesObject[0]));
                valueEnd = helpers.setTimeToDate(new Date(valuesObject[1]));

                this.dateArray = [valueStart, valueEnd];
            }

            this.trigger('dateChecked');
        },

        checkElement: function (e) {
            var $customTime = this.$el.find('.customTime');
            var className = this.type === 'date' ? 'checkedValue' : 'active';
            var optionsForGetDateHelper = {};

            var $currentTarget;
            var checkedId;
            var $target;
            var daysCount;
            var datesArray;

            if (typeof e !== 'string') {
                $currentTarget = $(e.currentTarget);
                $target = $(e.target);
                checkedId = $currentTarget.attr('data-id');
                if ($target.hasClass('active')) {
                    return this.toggleDateRange(e);
                }
            } else {
                $currentTarget = this.$el.find('[data-id="' + e + '"]');
                checkedId = e;
            }

            if (!this.onlyCustom) {
                $currentTarget
                    .addClass(className)
                    .siblings()
                    .removeClass(className);
            }

            if (checkedId !== 'custom') {
                $customTime.addClass('hidden');

                if (this.type === 'range') {
                    daysCount = $currentTarget.attr('data-day');
                    optionsForGetDateHelper.count = daysCount;

                    if (this.contentType === 'Opportunities') {
                        optionsForGetDateHelper.operator = 'subtract';
                    }
                }

                datesArray = !daysCount ? getDateHelper.getDate(checkedId) : getDateHelper.getDate(optionsForGetDateHelper);
                this.toggleDateRange(e);

                return this.updateValues(datesArray);
            } else if (e === 'custom') {
                this.updateValues(arguments[1]);
            }

            if ($target && !$target.closest('.customTime').length) {
                $customTime.toggleClass('hidden');
            }
        },

        bindDatePickers: function (dateArray) {
            var self = this;
            var $startDateInput = this.$el.find('#startDate' + this.contentType);
            var $endDateInput = this.$el.find('#endDate' + this.contentType);
            var startDate = new Date(dateArray[0]).toDateString();
            var endDate = new Date(dateArray[1]).toDateString();

            var endDateValue;

            if ($startDateInput.length) {

                $startDateInput
                    .datepicker({
                        dateFormat : 'd M, yy',
                        changeMonth: true,
                        changeYear : true,
                        defaultDate: new Date(startDate),
                        //  maxDate    : new Date(endDate),
                        onSelect   : function () {
                            self.$el.find('#endDate' + self.contentType).datepicker('option', 'minDate', $(this).val());
                            /* endDateValue = moment(new Date($(this).val())).endOf('month');
                             endDateValue = new Date(endDateValue);
                             $endDateInput.datepicker('setDate', endDateValue); */

                        }
                    }).datepicker('setDate', new Date(startDate));
            }

            if ($endDateInput.length) {
                $endDateInput
                    .datepicker({
                        dateFormat : 'd M, yy',
                        changeMonth: true,
                        changeYear : true,
                        defaultDate: new Date(endDate),
                        onSelect   : function () {
                            $startDateInput.datepicker('option', 'maxDate', $(this).val());
                        },
                        // minDate: new Date(startDate)
                    }).datepicker('setDate', new Date(endDate));
            }
        },

        render: function () {
            var template = this[this.type + 'Template'];

            this.$el.html(template({
                filterValuesCollection: this.collection,
                contentType           : this.contentType,
                onlyCustom            : this.onlyCustom,
                onlyEndDate           : this.onlyEndDate
            }));

            this.startDateSpan = this.$el.find('.startDateValue');
            this.endDateSpan = this.$el.find('.endDateValue');

            if (this.onlyEndDate) {
                this.startDateSpan.addClass('hidden');
            }

            return this;
        }
    });
    return DateView;
});
