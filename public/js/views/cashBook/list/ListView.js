define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/cashBook/list/ListHeader.html',
    'views/cashBook/list/ListItemView',
    'views/Filter/filterView',
    'collections/cashBook/filterCollection',
    'constants',
    'dataService',
    'helpers',
    'custom'
], function ($, _, listViewBase, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, dataService, helpers, custom) {
    'use strict';

    var ListView = listViewBase.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null,
        contentType       : CONSTANTS.CASHBOOK, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,

        initialize: function (options) {
            var dateRange;
            var jsonCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            jsonCollection = this.collection.toJSON();
            this.assets = jsonCollection[0] ? jsonCollection[0].assets : [];
            this.liabilities = jsonCollection[0] ? jsonCollection[0].liabilities : [];
            this.equity = jsonCollection[0] ? jsonCollection[0].equity : [];
            _.bind(this.collection.showMore, this.collection);
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.page;

            /* dateRange = custom.retriveFromCash('cashBookDateRange'); */

            this.filter = options.filter || custom.retriveFromCash('cashBook.filter');

            if (!this.filter) {
                this.filter = {};
            }

            /* if (!this.filter.startDate) {
             this.filter.startDate = {
             key  : 'startDate',
             value: new Date(dateRange.startDate)
             };
             this.filter.endDate = {
             key  : 'endDate',
             value: new Date(dateRange.endDate)
             };
             } */

            dateRange = this.filter.date ? this.filter.date.value : [];

            if (!this.filter.date) {
                this.filter.date = {
                    key  : 'date',
                    value: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };
            }

            /* this.startDate = new Date(this.filter.startDate.value);
             this.endDate = new Date(this.filter.endDate.value); */

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);
            this.contentCollection = reportCollection;

            custom.cacheToApp('cashBook.filter', this.filter);

            this.render();
        },

        changeDateRange: function (dateArray) {
            /* var stDate = $('#startDate').val();
             var enDate = $('#endDate').val(); */
            var searchObject;

            /* this.startDate = new Date(stDate);
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
             }; */

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            searchObject = {
                filter: this.filter
            };

            this.collection.showMore(searchObject);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('cashBook.filter', this.filter);
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var header = _.template(listTemplate);

            $currentEl.html('');
            $currentEl.find('#listTable').html('');

            collection = newModels.toJSON();

            this.data = collection[0].data;
            this.accounts = collection[0].accounts;

            $currentEl.append(header({accounts: this.accounts}));

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            this.renderBalance(this.accounts);
        },

        showFilteredPage: function (filter, context) {
            var itemsNumber = $('#itemsNumber').text();

            context.startTime = new Date();
            context.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            context.changeLocationHash(1, itemsNumber, filter);
            context.collection.showMore({
                count    : itemsNumber,
                page     : 1,
                filter   : filter,
                startDate: this.startDate,
                endDate  : this.endDate
            });
        },

        renderBalance: function (accounts) {
            var $table = this.$el.find('#listTable');
            var $trFirst = $table.find('tr').first();
            var $trs = $table.find('tr');
            var trLength = $trs.length;
            var i;
            var tds;
            var sumObject;
            var nextBalance;
            var keys;

            accounts.forEach(function (acc) {
                $trFirst.find('[data-id="' + acc._id + '"]').text(helpers.currencySplitter((acc.balance / 100 ).toFixed(2)));
                $trFirst.find('[data-id="' + acc._id + '"]').attr('data-value', acc.balance);
            });

            for (i = 1; i <= trLength; i++) {
                tds = $trs.find('[data-level="' + i + '"]');
                sumObject = {};
                nextBalance = $trs.find('[data-level="' + (i + 1) + '"]');

                tds.each(function () {
                    if (!sumObject[$(this).attr('data-id')]) {
                        sumObject[$(this).attr('data-id')] = 0;
                    }
                    sumObject[$(this).attr('data-id')] += parseFloat($(this).attr('data-value'));
                });

                keys = Object.keys(sumObject);

                keys.forEach(function (key) {
                    nextBalance.each(function () {
                        if ($(this).hasClass('balance') && $(this).attr('data-id') === key) {
                            $(this).text(helpers.currencySplitter((sumObject[key] / 100).toFixed(2)));
                            $(this).attr('data-value', sumObject[key]);
                        }
                    });

                });

            }

        },

        render: function () {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var header = _.template(listTemplate);
            var accounts = this.collection.toJSON()[0].accounts;

            $currentEl.html('');
            $currentEl.append(header({accounts: accounts}));

            collection = this.collection.toJSON();

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            App.filtersObject.filter = this.filter;

            this.renderBalance(accounts);

            return this;
        }
    });
    return ListView;
});
