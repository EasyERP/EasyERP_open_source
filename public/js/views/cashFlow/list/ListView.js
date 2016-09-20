define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/cashFlow/list/ListHeader.html',
    'views/cashFlow/list/ListItemView',
    'views/Filter/filterView',
    'collections/cashFlow/filterCollection',
    'constants',
    'dataService',
    'helpers',
    'custom',
    'async',
    'common'
], function ($, _, listViewBase, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, dataService, helpers, custom, async, common) {
    'use strict';

    var ListView = listViewBase.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null,
        contentType       : CONSTANTS.CASHFLOW, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,

        events: {
            'click .mainTr': 'showHidden'
        },

        initialize: function (options) {
            var dateRange;
            var jsonCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            jsonCollection = this.collection.toJSON();
            this.operating = jsonCollection[0] ? jsonCollection[0].operating : [];
            this.financing = jsonCollection[0] ? jsonCollection[0].financing : [];
            this.investing = jsonCollection[0] ? jsonCollection[0].investing : [];
            _.bind(this.collection.showMore, this.collection);
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.page;
            dateRange = custom.retriveFromCash('cashFlowDateRange');

            this.filter = options.filter || custom.retriveFromCash('cashFlow.filter');

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

            this.contentCollection = reportCollection;
            custom.cacheToApp('cashFlow.filter', this.filter);
        },

        showHidden: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var dataId = $tr.attr('data-id');
            var $body = this.$el;
            var childTr = $body.find('[data-main="' + dataId + '"]');
            var span = $tr.find('.expand').find('span');
            var sign = $.trim(span.attr('class'));

            if (sign === 'icon-caret-right') {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');
            }

            childTr.toggleClass();
        },

        asyncRenderInfo: function (asyncKeys) {
            var body = this.$el;
            var stDate = this.filter.startDate.value;
            var endDate = this.filter.endDate.value;

            async.each(asyncKeys, function (asyncId) {
                dataService.getData('journalEntries/getAsyncDataForGL', {
                    startDate: stDate,
                    endDate  : endDate,
                    _id      : asyncId
                }, function (result) {
                    var journalEntries = result.journalEntries;
                    var mainTr = body.find('[data-id="' + asyncId + '"]');
                    journalEntries.forEach(function (entry) {
                        mainTr.after("<tr data-main='" + asyncId + " 'class='hidden'><td colspan='2' class='leftBorderNone'>" + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td class='money'>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + '</td></tr>');
                    });
                });

            });

        },

        changeDateRange: function () {
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
                startDate: stDate,
                endDate  : enDate,
                filter   : this.filter
            };

            this.collection.showMore(searchObject);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('cashFlow.filter', this.filter);
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];

            this.$el.find('#listTableOperating').html('');
            this.$el.find('#listTableInvesting').html('');
            this.$el.find('#listTableFinancing').html('');

            collection = newModels.toJSON();

            this.operating = collection[0].operating;
            this.investing = collection[0].investing;
            this.financing = collection[0].financing;

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            this.operating.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.investing.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.financing.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.asyncRenderInfo(asyncKeys);
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

        render: function () {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            collection = this.collection.toJSON();

            this.operating.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.investing.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.financing.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.$el.find('#listTableOperating').html('');
            this.$el.find('#listTableInvesting').html('');
            this.$el.find('#listTableFinancing').html('');

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            App.filtersObject.filter = this.filter;

            this.asyncRenderInfo(asyncKeys);

            return this;
        }
    });
    return ListView;
});
