define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/profitAndLoss/list/ListHeader.html',
    'views/profitAndLoss/list/ListItemView',
    'views/Filter/filterView',
    'views/journalEntry/ViewSource',
    'collections/profitAndLoss/filterCollection',
    'constants',
    'views/guideTours/guideNotificationView',
    'dataService',
    'helpers',
    'custom',
    'async',
    'common'
], function ($, _, listViewBase, listTemplate, ListItemView, FilterView, View, reportCollection, CONSTANTS, GuideNotify, dataService, helpers, custom, async, common) {
    'use strict';

    var ListView = listViewBase.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null,
        contentType       : CONSTANTS.PROFITANDLOSS, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,
        responseObj       : {},

        events: {
            'click .mainTr': 'showHidden',
            'click .source': 'viewSourceDocument'
        },

        initialize: function (options) {
            var dateRange;
            var jsonCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            jsonCollection = this.collection.toJSON();
            this.income = jsonCollection[0] ? jsonCollection[0].income : [];
            this.expenses = jsonCollection[0] ? jsonCollection[0].expenses : [];
            this.dividends = jsonCollection[0] ? jsonCollection[0].dividends : 0;
            this.cogs = jsonCollection[0] ? jsonCollection[0].cogs : 0;
            this.taxes = jsonCollection[0] ? jsonCollection[0].taxes : 0;

            _.bind(this.collection.showMore, this.collection);

            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.page;

            this.filter = options.filter || custom.retriveFromCash('profitAndLoss.filter');

            if (!this.filter) {
                this.filter = {};
            }

            dateRange = this.filter.date ? this.filter.date.value : [];

            if (!this.filter.date) {
                this.filter.date = {
                    key  : 'date',
                    value: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };
            }

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);
            this.contentCollection = reportCollection;

            custom.cacheToApp('profitAndLoss.filter', this.filter);

            this.render();
            this.responseObj['#source'] = [
                {
                    _id : 'source',
                    name: 'View Source Document'
                }
            ];
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

        showHidden: function (e) {
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var dataId = $tr.attr('data-id');
            var $body = this.$el;
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

            childTr.toggleClass('hidden');
        },

        asyncRenderInfo: function (asyncKeys) {
            var self = this;
            var body = this.$el;

            async.each(asyncKeys, function (asyncId) {
                dataService.getData('journalEntries/getAsyncDataForGL', {
                    filter: self.filter,
                    _id   : asyncId
                }, function (result) {
                    var journalEntries = result.journalEntries;
                    var mainTr = body.find('[data-id="' + asyncId + '"]');
                    journalEntries.forEach(function (entry) {
                        mainTr.after("<tr data-main='" + asyncId + "' class='hidden childRow'><td></td><td class='leftBorderNone source'><span class='current-selected' data-id='" + entry.sourceDocument._id + "' data-name='" + entry.sourceDocument.model + "' data-employee='" + entry.sourceDocument.employee + "'>" + entry.sourceDocument.name + '</span></td><td>' + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td class='money textRight'>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + '</td></tr>');
                    });
                });

            });

        },

        changeDateRange: function (dateArray) {
            var searchObject;

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

            custom.cacheToApp('profitAndLoss.filter', this.filter);
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];

            this.$el.find('#listTableIncome').html('');
            this.$el.find('#listTableCogs').html('');
            this.$el.find('#listTableExpenses').html('');
            this.$el.find('#listTableTaxes').html('');
            this.$el.find('#listTableDividends').html('');

            collection = newModels.toJSON();

            this.income = collection[0].income;
            this.expenses = collection[0].expenses;
            this.dividends = collection[0].dividends;
            this.taxes = collection[0].taxes;
            this.cogs = collection[0].cogs;

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            this.expenses.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.income.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.dividends.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.taxes.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.cogs.forEach(function (el) {
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

            this.expenses.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.income.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.dividends.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.taxes.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.cogs.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.$el.find('#listTableIncome').html('');
            this.$el.find('#listTableCogs').html('');
            this.$el.find('#listTableExpenses').html('');
            this.$el.find('#listTableTaxes').html('');
            this.$el.find('#listTableDividends').html('');

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            App.filtersObject.filter = this.filter;

            this.asyncRenderInfo(asyncKeys);

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            return this;
        }
    });
    return ListView;
});
