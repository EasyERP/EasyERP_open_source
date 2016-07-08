define([
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'text!templates/inventoryReport/list/ListHeader.html',
    'views/inventoryReport/list/ListItemView',
    'collections/inventoryReport/filterCollection',
    'constants',
    'helpers',
    'dataService',
    'common',
    'moment',
    'custom'
], function (_, $, listViewBase, listTemplate, ListItemView, contentCollection, CONSTANTS, helpers, dataService, common, moment, custom) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.INVENTORYREPORT,
        hasPagination    : true,

        initialize: function (options) {
            var dateRange;

            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.filter = options.filter || custom.retriveFromCash('inventoryReport.filter');

            if (!this.filter) {
                this.filter = {};
            }

            // dateRange = custom.retriveFromCash('inventoryReportDateRange');

            dateRange = this.filter.date ? this.filter.date.value : [];

            /*if (!this.filter.startDate) {
                this.filter.startDate = {
                    key  : 'startDate',
                    value: new Date(dateRange.startDate)
                };
                this.filter.endDate = {
                    key  : 'endDate',
                    value: new Date(dateRange.endDate)
                };
            }*/

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            /*this.startDate = new Date(this.filter.startDate.value);
            this.endDate = new Date(this.filter.endDate.value);*/

            custom.cacheToApp('inventoryReport.filter', this.filter);

            options.filter = this.filter;

            listViewBase.prototype.initialize.call(this, options);
        },

        changeDateRange: function () {
            var itemsNumber = $('#itemsNumber').text();
            var stDate = $('#startDate').val();
            var enDate = $('#endDate').val();
            var searchObject;

            this.startDate = new Date(stDate);
            this.endDate = new Date(enDate);

            if (!this.filter) {
                this.filter = {};
            }

            /*this.filter.startDate = {
                key  : 'startDate',
                value: stDate
            };

            this.filter.endDate = {
                key  : 'endDate',
                value: enDate
            };*/

            this.filter.date = {
                value: [stDate, enDate]
            };

            searchObject = {
                page     : 1,
                startDate: stDate,
                endDate  : enDate,
                filter   : this.filter
            };

            this.collection.showMore(searchObject);
            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('inventoryReport.filter', this.filter);
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $('#itemsNumber').text();

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            custom.cacheToApp('inventoryReport.filter', this.filter);

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.showMore({
                count    : itemsNumber,
                page     : 1,
                filter   : filter,
                startDate: this.startDate,
                endDate  : this.endDate
            });
        },

        recalcTotal: function () {
            var $curEl = this.$el;
            var $rows = $curEl.find('#listTable tr').not('#listFooter');

            var columns = ['openingBalance', 'inwards', 'outwards', 'closingBalance'];

            columns.forEach(function (col) {
                var total = 0;

                $rows.each(function (index, element) {
                    var $curElement = $(element);
                    var $val = $curElement.find('.' + col);

                    var val = parseFloat($val.attr('data-amount'));

                    total += val;
                });

                $curEl.find('#listFooter').find('#' + col + 'Total').text(helpers.currencySplitter(total.toFixed(2)));
                return total;
            });

        },

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                page       : this.collection.page,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.prepend(itemView.render());

            // this.renderFilter();

            this.recalcTotal();

            // this.renderPagination($currentEl, this);

            App.filtersObject.filter = this.filter;

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }

    });

    return ListView;
});
