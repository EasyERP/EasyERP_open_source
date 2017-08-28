define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/cashFlow/list/ListHeader.html',
    'views/cashFlow/list/ListItemView',
    'views/Filter/filterView',
    'views/journalEntry/ViewSource',
    'collections/cashFlow/filterCollection',
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
        contentType       : CONSTANTS.CASHFLOW, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,
        responseObj       : {},

        events: {
            'click .mainTr' : 'showHidden',
            'click .childTr': 'showHiddenSub',
            'click .source' : 'viewSourceDocument'
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

            this.filter = options.filter || custom.retriveFromCash('cashFlow.filter');

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

            this.render();

            this.contentCollection = reportCollection;
            custom.cacheToApp('cashFlow.filter', this.filter);

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
            var self = this;
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

            if (hide) {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');
            }

            if (hide) {
                return childTr.addClass('hidden');
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
                    var mainTr = body.find("[data-account='" + asyncId + "']");
                    journalEntries.forEach(function (entry) {
                        mainTr.after("<tr data-main='" + asyncId + "' class='subTr hidden'><td></td></td><td class='leftBorderNone source'><span class='current-selected' data-id='" + entry.sourceDocument._id + "' data-name='" + entry.sourceDocument.model + "' data-employee='" + entry.sourceDocument.employee + "'>" + entry.sourceDocument.name + '</span></td><td>' + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td class='money'>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + '</td></tr>');
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
                el.root && el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
            });

            this.investing.forEach(function (el) {
                el.root && el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
            });

            this.financing.forEach(function (el) {
                el.root && el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
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
                el.root && el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
            });

            this.investing.forEach(function (el) {
                el.root && el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
            });

            this.financing.forEach(function (el) {
                el.root && el.root.forEach(function (elem) {
                    asyncKeys.push(elem._id._id);
                });
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
