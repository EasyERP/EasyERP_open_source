/**
 * Created by liliy on 18.03.2016.
 */

"use strict";
define([
        "jQuery",
        "Underscore",
        'views/listViewBase',
        'text!templates/balanceSheet/list/ListHeader.html',
        'views/balanceSheet/list/ListItemView',
        'views/Filter/FilterView',
        'collections/balanceSheet/filterCollection',
        'constants',
        'dataService',
        'helpers',
        'custom',
        'async',
        'common'
    ],

    function ($, _, listViewBase, listTemplate, ListItemView, FilterView, reportCollection, CONSTANTS, dataService, helpers, custom, async, common) {
        var ListView = listViewBase.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            sort              : null,
            newCollection     : null,
            page              : null,
            contentType       : CONSTANTS.BALANCESHEET,//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash
            yearElement       : null,
            filterView        : FilterView,

            events: {
                'click .mainTr': 'showHidden'
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                var jsonCollection = this.collection.toJSON();
                this.assets = jsonCollection[0] ? jsonCollection[0].assets : [];
                this.liabilities = jsonCollection[0] ? jsonCollection[0].liabilities : [];
                this.equity = jsonCollection[0] ? jsonCollection[0].equity : [];
                _.bind(this.collection.showMore, this.collection);
                this.sort = options.sort || {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.page = options.collection.page;
                var dateRange = custom.retriveFromCash('balanceSheetDateRange');

                this.filter = options.filter || custom.retriveFromCash('balanceSheet.filter');

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
                custom.cacheToApp('balanceSheet.filter', this.filter);
            },

            showHidden: function (e) {
                var $target = $(e.target);
                var $tr = $target.closest('tr');
                var dataId = $tr.attr('data-id');
                var $body = this.$el;
                var childTr = $body.find("[data-main='" + dataId + "']");
                var sign = $.trim($tr.find('.expand').text());

                if (sign === '+') {
                    $tr.find('.expand').text('-');
                } else {
                    $tr.find('.expand').text('+');
                }

                childTr.toggleClass();
            },

            asyncRenderInfo: function (asyncKeys) {
                var self = this;
                var body = this.$el;

                async.each(asyncKeys, function (asyncId) {
                    dataService.getData('/journal/journalEntry/getAsyncDataForGL', {
                        startDate: self.startDate,
                        endDate  : self.endDate,
                        _id      : asyncId
                    }, function (result) {
                        var journalEntries = result.journalEntries;
                        var mainTr = body.find("[data-id='" + asyncId + "']");
                        journalEntries.forEach(function (entry) {
                            mainTr.after("<tr data-main='" + asyncId + "' class='hidden'><td colspan='3' class='leftBorderNone'>" + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + "</td></tr>");
                        });
                    });

                });

            },

            changeDateRange: function () {
                var stDate = $('#startDate').val();
                var enDate = $('#endDate').val();

                this.startDate = new Date(stDate);
                this.endDate = new Date(enDate);

                if (!this.filter) {
                    this.filter = {};
                }

                this.filter.startDate = {
                    key  : 'startDate',
                    value: this.startDate
                };

                this.filter.endDate = {
                    key  : 'endDate',
                    value: this.endDate
                };

                var searchObject = {
                    startDate: stDate,
                    endDate  : enDate,
                    filter   : this.filter
                };

                this.collection.showMore(searchObject);

                App.filter = this.filter;

                custom.cacheToApp('balanceSheet.filter', this.filter);
            },

            showMoreContent: function (newModels) {
                var $currentEl = this.$el;
                var collection;
                var itemView;
                var asyncKeys = [];

                this.$el.find("#listTableAssets").html('');
                this.$el.find("#listTableLiabilities").html('');
                this.$el.find("#listTableEquity").html('');

                collection = newModels.toJSON();

                this.assets = collection[0].assets;
                this.liabilities = collection[0].liabilities;
                this.equity = collection[0].equity;

                itemView = new ListItemView({
                    collection      : collection,
                    currencySplitter: helpers.currencySplitter
                });

                $currentEl.append(itemView.render());

                this.liabilities.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                this.assets.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                this.equity.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                this.asyncRenderInfo(asyncKeys);
            },

            showFilteredPage: function (filter, context) {
                var itemsNumber = $("#itemsNumber").text();

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

                this.liabilities.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                this.assets.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                 this.equity.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                this.$el.find("#listTableLiabilities").html('');
                this.$el.find("#listTableAssets").html('');
                this.$el.find("#listTableEquity").html('');

                itemView = new ListItemView({
                    collection      : collection,
                    currencySplitter: helpers.currencySplitter
                });

                $currentEl.append(itemView.render());

                App.filter = this.filter;

                this.asyncRenderInfo(asyncKeys);

                //this.renderFilter(self);

                return this;
            }
        });
        return ListView;
    });