define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'text!templates/journalEntry/list/ListHeader.html',
    'views/journalEntry/list/ListItemView',
    'views/selectView/selectView',
    'views/journalEntry/ViewSource',
    'collections/journalEntry/filterCollection',
    'constants',
    'helpers',
    'dataService',
    'common',
    'moment',
    'custom'
], function (Backbone,
             _,
             $,
             ListViewBase,
             listTemplate,
             ListItemView,
             SelectView,
             View,
             contentCollection,
             CONSTANTS,
             helpers,
             dataService,
             common,
             moment,
             custom) {

    'use strict';

    var ListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.JOURNALENTRY,
        exportToXlsxUrl  : 'journalEntries/exportToXlsx',
        exportToCsvUrl   : 'journalEntries/exportToCsv',
        hasPagination    : true,
        responseObj      : {},

        events: {
            'click .source'       : 'viewSourceDocument',
            'click .clickToFilter': 'addFilter'
        },

        initialize: function (options) {
            var dateRange;

            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;
            this.totalDebit = options.collection.totalDebit;
            this.totalCredit = options.collection.totalCredit;

            this.filter = options.filter || custom.retriveFromCash('journalEntry.filter');

            if (!this.filter) {
                this.filter = {};
            }

            dateRange = this.filter.date ? this.filter.date.value : [];

            if (!this.filter.date) {
                this.filter.date = {
                    value: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };
            }

            options.filter = this.filter;

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            ListViewBase.prototype.initialize.call(this, options);

            custom.cacheToApp('journalEntry.filter', this.filter);

            this.responseObj['#source'] = [
                {
                    _id : 'source',
                    name: 'View Source Document'
                }
            ];
        },

        addFilter: function (e) {
            var $target = $(e.target);
            var closestEl = $target.closest('a');
            var dataId = closestEl.attr('data-id');
            var dataGroup = closestEl.attr('data-group');
            var filter = this.filter || {};

            if (filter && !filter[dataGroup]) {
                filter[dataGroup] = {
                    key  : 'account._id',
                    value: []
                };
            }

            if (filter && filter[dataGroup]) {
                filter[dataGroup].value.push(dataId);
            }

            this.showFilteredPage(filter);
            this.renderFilter(filter);
        },

        viewSourceDocument: function (e) {
            var $target = $(e.target).closest('.source');
            var closestSpan = $target.find('.current-selected');
            var dataId = closestSpan.attr('data-id');
            var dataName = closestSpan.attr('data-name');
            var dataEmployee = closestSpan.attr('data-employee');
            var data;

            App.startPreload();

            if (this.selectView) {
                this.selectView.remove();
            }

            return new View({type: dataName, employee: dataEmployee, dataId: dataId});
        },

        changeDateRange: function (dateArray) {
            var itemsNumber = $('#itemsNumber').text();
            var searchObject;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            searchObject = {
                page  : 1,
                filter: this.filter
            };

            this.collection.getFirstPage(searchObject);

            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('journalEntry.filter', this.filter);
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $('#itemsNumber').text();

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            custom.cacheToApp('journalEntry.filter', this.filter);

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.getFirstPage({
                count : itemsNumber,
                page  : 1,
                filter: filter
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
                itemsNumber: this.collection.namberToShow
            });

            dataService.getData('journalEntries/getReconcileDate', {}, function (result) {
                var newDate = moment(new Date());
                var date = moment(result.date);
                var same = false;

                $('#reconcileDate').text(common.utcDateToLocaleDate(result.date));

                if (newDate.isSame(date, 'month') && newDate.isSame(date, 'year') && newDate.isSame(date, 'date')) {
                    same = true;
                }

                if (same) {
                    $('#reconcileBtn').addClass('btnSuccess');
                } else {
                    $('#reconcileBtn').addClass('btnAttention');
                }

            });

            $currentEl.prepend(itemView.render());

            this.$el.find('#totalDebit').text(helpers.currencySplitter((this.totalDebit / 100).toFixed(2)));
            this.$el.find('#totalCredit').text(helpers.currencySplitter((this.totalCredit / 100).toFixed(2)));

            App.filtersObject.filter = this.filter;
        }
    });

    return ListView;
});
