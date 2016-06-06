define([
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'text!templates/inventoryReport/list/ListHeader.html',
    'views/inventoryReport/list/ListItemView',
    'views/Filter/FilterView',
    'collections/inventoryReport/filterCollection',
    'constants',
    'helpers',
    'dataService',
    'common',
    'moment',
    'custom'
], function (_, $, listViewBase, listTemplate, ListItemView, filterView, contentCollection, CONSTANTS, helpers, dataService, common, moment, custom) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate            : listTemplate,
        LstItemView             : ListItemView,
        filterView              : filterView,
        contentCollection       : contentCollection,
        contentType             : CONSTANTS.INVENTORYREPORT,

        initialize: function (options) {
            var dateRange;

            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            dateRange = custom.retriveFromCash('inventoryReportDateRange');

            this.filter = options.filter || custom.retriveFromCash('inventoryReport.filter');

            if (!this.filter) {
                this.filter = {};
            }

            if (!this.filter.startDate) {
                this.filter.startDate = {
                    key  : 'startDate',
                    value: new Date(dateRange.startDate)
                };
                this.filter.endDate = {
                    key  : 'endDate',
                    value: new Date(dateRange.endDate)
                };
            }

            this.startDate = new Date(this.filter.startDate.value);
            this.endDate = new Date(this.filter.endDate.value);

            this.render();

            custom.cacheToApp('inventoryReport.filter', this.filter);
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

            this.filter.startDate = {
                key  : 'startDate',
                value: stDate
            };

            this.filter.endDate = {
                key  : 'endDate',
                value: enDate
            };

            searchObject = {
                page     : 1,
                startDate: stDate,
                endDate  : enDate,
                filter   : this.filter
            };

            this.collection.showMore(searchObject);
            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filter = this.filter;

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

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var itemView;
            var pagenation;
            var page = parseInt(holder.find('#currentShowPage').val(), 10) || 1; // if filter give 0 elements

            holder.find('#listTable').empty();

            itemView = new this.ListItemView({
                collection : newModels,
                page       : page,
                itemsNumber: this.defaultItemsNumber
            });

            holder.append(itemView.render());

            itemView.undelegateEvents();

            pagenation = holder.find('.pagination');

            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }

            $('#top-bar-deleteBtn').hide();
            $('#check_all').prop('checked', false);

            this.calcTotal();

            holder.find('#timeRecivingDataFromServer').remove();
            holder.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        calcTotal: function () {
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

            this.renderCheckboxes();

            this.calcTotal();

            this.renderPagination($currentEl, this);

            App.filter = this.filter;

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }

    });

    return ListView;
});
