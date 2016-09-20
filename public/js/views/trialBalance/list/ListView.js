define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/trialBalance/list/ListHeader.html',
    'views/trialBalance/list/ListItemView',
    'collections/trialBalance/filterCollection',
    'constants',
    'dataService',
    'helpers',
    'custom',
    'async',
    'common'
], function ($, _, listViewBase, listTemplate, ListItemView, reportCollection, CONSTANTS, dataService, helpers, custom, async, common) {
    'use strict';

    var ListView = listViewBase.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null,
        contentType       : CONSTANTS.TRIALBALANCE, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,

        events: {
            'click .mainTr' : 'showHidden',
            'click .childTr': 'showHiddenSub'
        },

        initialize: function (options) {
            var dateRange;

            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMore, this.collection);
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.page;

            dateRange = custom.retriveFromCash('trialBalanceDateRange');

            this.filter = options.filter || custom.retriveFromCash('trialBalance.filter');

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
            custom.cacheToApp('trialBalance.filter', this.filter);
        },

        showHidden: function (e) {
            var self = this;
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var dataId = $tr.attr('data-id');
            var $body = this.$el.find('#listTable');
            var childTr = $body.find("[data-main='" + dataId + "']");
            var span = $tr.find('.expand').find('span');
            var sign = $.trim(span.attr('class'));

            if (sign === 'icon-caret-right') {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');

                childTr.each(function (tr) {
                    self.showHiddenSub(null, $(this), true);
                });
            }

            childTr.toggleClass('hidden');
        },

        showHiddenSub: function (e, target, hide) {
            var $target = e ? $(e.target) : null;
            var $tr = $target ? $target.closest('tr') : target;
            var dataId = $tr.attr('data-account');
            var $body = this.$el.find('#listTable');
            var childTr = $body.find("[data-main='" + dataId + "']");
            var span = $tr.find('.expand').find('span');
            var sign = $.trim(span.attr('class'));

            if (sign === 'icon-caret-right') {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');
            }

            if (hide) {
                return childTr.addClass('hidden');
            }

            childTr.toggleClass('hidden');

        },

        asyncRenderInfo: function (asyncKeys) {
            var body = this.$el.find('#listTable');
            var stDate = this.filter.startDate.value;
            var endDate = this.filter.endDate.value;

            async.each(asyncKeys, function (asyncId) {
                dataService.getData('journalEntries/getAsyncDataForGL', {
                    startDate  : stDate,
                    endDate    : endDate,
                    contentType: 'trialBalance',
                    _id        : asyncId
                }, function (result) {
                    var journalEntries = result.journalEntries;
                    var mainTr = body.find("[data-account='" + asyncId + "']");
                    journalEntries.forEach(function (entry) {
                        mainTr.after("<tr data-main='" + asyncId + "' class='subTr hidden'><td></td><td class='leftBorderNone'>" + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td class='money'>" + helpers.currencySplitter((entry.debit / 100).toFixed(2)) + "</td><td class='money'>" + helpers.currencySplitter((entry.credit / 100).toFixed(2)) + "</td><td class='money'>" + helpers.currencySplitter(((entry.debit - entry.credit) / 100).toFixed(2)) + "</td></tr>");
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

            custom.cacheToApp('trialBalance.filter', this.filter);
            custom.cacheToApp('trialBalanceDateRange', {startDate: this.startDate, endDate: this.endDate});
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];

            this.$el.find('#listTable').html('');

            collection = newModels.toJSON();

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            collection.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
            });

            $currentEl.append(itemView.render());

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
            var self = this;
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            collection = this.collection.toJSON();

            collection.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
            });

            this.$el.find('#listTable').html('');

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
