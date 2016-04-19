/**
 * Created by liliy on 02.03.2016.
 */
"use strict";
define([
        "jQuery",
        "Underscore",
        'views/listViewBase',
        'text!templates/trialBalance/list/ListHeader.html',
        'views/trialBalance/list/ListItemView',
        'views/Filter/FilterView',
        'collections/trialBalance/filterCollection',
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
            contentType       : CONSTANTS.TRIALBALANCE,//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash
            yearElement       : null,
            filterView        : FilterView,

            events: {
                'click .mainTr': 'showHidden'
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.sort = options.sort || {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.page = options.collection.page;
                var dateRange = custom.retriveFromCash('trialBalanceDateRange');

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
                var $target = $(e.target);
                var $tr = $target.closest('tr');
                var dataId = $tr.attr('data-id');
                var $body = this.$el.find('#listTable');
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
                var body = this.$el.find('#listTable');

                async.each(asyncKeys, function (asyncId) {
                    dataService.getData('/journal/journalEntry/getAsyncDataForGL', {
                        startDate: self.startDate,
                        endDate  : self.endDate,
                        _id      : asyncId
                    }, function (result) {
                        var journalEntries = result.journalEntries;
                        var mainTr = body.find("[data-id='" + asyncId + "']");
                        journalEntries.forEach(function (entry) {
                            mainTr.after("<tr data-main='" + asyncId + "' class='hidden'><td colspan='3' class='leftBorderNone'>" + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td>" + helpers.currencySplitter((entry.debit / 100).toFixed(2)) + "</td><td>" + helpers.currencySplitter((entry.credit / 100).toFixed(2)) + "</td><td>" + helpers.currencySplitter(((entry.debit - entry.credit) / 100).toFixed(2)) + "</td></tr>");
                        });
                    });

                });

            },

            /*goSort: function (e) {
                var target = $(e.target);
                var currentParrentSortClass = target.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var dataSort = target.attr('data-sort');
                var sortConst = 1;
                var collection;
                var itemView;

                if (!sortClass) {
                    target.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target.removeClass('sortDn').addClass('sortUp');
                        sortConst = -1;
                    }
                        break;
                    case "sortUp":
                    {
                        target.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target.removeClass('sortUp').addClass('sortDn');
                        sortConst = 1;
                    }
                        break;
                }

                this.collection.sortByOrder(dataSort, sortConst);

                this.$el.find("#listTable").html('');

                collection = this.collection.toJSON();

                itemView = new ListItemView({
                    collection      : collection,
                    currencySplitter: helpers.currencySplitter
                });

                this.$el.append(itemView.render());
            },*/

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
                    value: stDate
                };

                this.filter.endDate = {
                    key  : 'endDate',
                    value: enDate
                };

                var searchObject = {
                    startDate: stDate,
                    endDate  : enDate,
                    filter   : this.filter
                };

                this.collection.showMore(searchObject);

                App.filter = this.filter;

                custom.cacheToApp('trialBalance.filter', this.filter);
            },

            showMoreContent: function (newModels) {
                var $currentEl = this.$el;
                var collection;
                var itemView;
                var asyncKeys = [];

                this.$el.find("#listTable").html('');

                collection = newModels.toJSON();

                itemView = new ListItemView({
                    collection      : collection,
                    currencySplitter: helpers.currencySplitter
                });

                $currentEl.append(itemView.render());

                collection.forEach(function (el) {
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

                collection.forEach(function (el) {
                    asyncKeys.push(el._id);
                });

                this.$el.find("#listTable").html('');

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