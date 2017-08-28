define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/balanceSheet/list/ListHeader.html',
    'views/balanceSheet/list/ListItemView',
    'views/Filter/filterView',
    'views/journalEntry/ViewSource',
    'collections/balanceSheet/filterCollection',
    'constants',
    'views/guideTours/guideNotificationView',
    'dataService',
    'helpers',
    'custom',
    'async',
    'common'
], function (Backbone,
             $,
             _,
             listViewBase,
             listTemplate,
             ListItemView,
             FilterView,
             View,
             reportCollection,
             CONSTANTS,
             GuideNotify,
             dataService,
             helpers,
             custom,
             async,
             common) {
    'use strict';

    var ListView = listViewBase.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null,
        contentType       : CONSTANTS.BALANCESHEET, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,
        responseObj       : {},

        events: {
            'click .mainTr': 'showHidden',
            'click .subTr' : 'showHiddenSurtrs',
            'click .source': 'viewSourceDocument'
        },

        initialize: function (options) {
            var dateRange;
            var jsonCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            jsonCollection = this.collection.toJSON();
            this.fixedAssets = jsonCollection[0] ? jsonCollection[0].fixedAssets : [];
            this.currentAssets = jsonCollection[0] ? jsonCollection[0].currentAssets : [];
            this.liabilities = jsonCollection[0] ? jsonCollection[0].liabilities : [];
            this.equity = jsonCollection[0] ? jsonCollection[0].equity : [];
            _.bind(this.collection.showMore, this.collection);
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.page;

            this.filter = options.filter || custom.retriveFromCash('balanceSheet.filter');

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

            custom.cacheToApp('balanceSheet.filter', this.filter);

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
            var tr = closestSpan.closest('tr');
            var dataCategory = tr.attr('data-main');
            var data;

            this.filter.category = dataCategory;
            this.filter.account = dataId;

            var url = 'easyErp/trialBalance/list/filter=' + encodeURIComponent(JSON.stringify(this.filter));

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});

            /*App.startPreload();

            if (this.selectView) {
                this.selectView.remove();
            }

            return new View({type: dataName, employee: dataEmployee, dataId: dataId});*/
        },

        showHidden: function (e) {
            var self = this;
            var $target = $(e.target);
            var $tr = $target.closest('tr');
            var level = $tr.attr('data-level') + 1;
            var dataId = $tr.attr('data-id');
            var $body = this.$el;
            var childTr = $body.find("[data-main='" + dataId + "'], [data-id='" + dataId + "'], [data-category='" + dataId + "'], [data-parent='" + dataId + "']").not('.mainTr');
            var span = $tr.find('.expand').find('span');
            var sign = $.trim(span.attr('class'));

            childTr.find('.subTr, .childTr');

            if (sign === 'icon-caret-right') {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');

                childTr.each(function (tr) {
                    self.showHiddenSurtrs(null, $(this), true);
                });
            }

            childTr.toggleClass('hidden');
        },

        showHiddenSurtrs: function (e, target, hide) {
            var self = this;
            var $target = e ? $(e.target) : null;
            var $tr = $target ? $target.closest('tr') : target;
            var dataId = $tr.attr('data-ident');
            var $body = this.$el;
            var childTr = $body.find("[data-parent='" + dataId + "']");
            var span = $tr.find('.expand').find('span');
            var sign = $.trim(span.attr('class'));
            var level = $tr.attr('data-level') + 1;

            if (!childTr.length) {
                childTr = $body.find("[data-id='" + dataId + "']");
            }

            childTr.find('.subTr, .childTr');

            childTr.find("[data-level=" + level + "]");

            if (sign === 'icon-caret-right') {
                span.removeClass('icon-caret-right');
                span.addClass('icon-caret-down');
            } else {
                span.removeClass('icon-caret-down');
                span.addClass('icon-caret-right');

                childTr.each(function (tr) {
                    self.showHiddenSurtrs(null, $(this), true);
                });
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
                dataService.getData('journalEntries/getAsyncForBalanceSheet', {
                    category: asyncId._id,
                    filter  : self.filter
                }, function (result) {
                    var data = result.data;
                    var mainTr = body.find("[data-ident='" + asyncId._id + "']");
                    var subTrs = body.find("[data-main='" + asyncId._id + "'], [data-id='" + asyncId._id + "'], [data-category='" + asyncId._id + "'], [data-parent='" + asyncId._id + "']").not('.mainTr');

                    subTrs.find('.subTr, .childTr');

                    if (!mainTr.length) {
                        mainTr = body.find("[data-id='" + (asyncId._id + asyncId.group) + "']");
                    }

                    if (!data.length && !subTrs.length) {
                        mainTr.find('td.expand').html('');
                    }
                    data.forEach(function (entry) {
                        var tds;

                        var row = "<tr data-parent='" + asyncId._id + "'data-category='" + (asyncId._id + asyncId.group) + "' data-main='" + asyncId._id + "' class='childTr hidden'><td></td><td class='leftBorderNone source'><span title='View General Ledger' class='current-selected' data-id='" + entry.account._id + "'>" + entry.account.name + '</span></td>';

                        tds = "<td class='money'>" + helpers.currencySplitter((entry.debit / 100).toFixed(2)) + '</td><td>' + helpers.currencySplitter((entry.credit / 100).toFixed(2)) + '</td><td>' + helpers.currencySplitter(((entry.debit - entry.credit) / 100).toFixed(2)) + '</td></tr>';
                        mainTr.after(row + tds);
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

            custom.cacheToApp('balanceSheet.filter', this.filter);
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];
            var uniqObbj = {};

            this.$el.find('#listTableLiabilities').html('');
            this.$el.find('#listTableCurrentAssets').html('');
            this.$el.find('#listTableFixedAssets').html('');
            this.$el.find('#listTableEquity').html('');
            this.$el.find('#currentEarningsFooter').find('.money').html('');

            collection = newModels.toJSON();

            this.fixedAssets = collection[0].fixedAssets;
            this.currentAssets = collection[0].currentAssets;
            this.liabilities = collection[0].liabilities;
            this.equity = collection[0].equity;

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            this.liabilities.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'liabilities'
                        });
                    }

                });
                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'liabilities'
                    });
                }
            });

            this.currentAssets.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'assets'
                        });
                    }
                });

                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'assets'
                    });
                }
            });

            this.fixedAssets.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'assets'
                        });
                    }
                });
                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'assets'
                    });
                }
            });

            this.equity.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'equity'
                        });
                    }
                });

                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'equity'
                    });
                }
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
            var uniqObbj = {};

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));

            collection = this.collection.toJSON();

            this.liabilities.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'liabilities'
                        });
                    }

                });
                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'liabilities'
                    });
                }
            });

            this.currentAssets.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'assets'
                        });
                    }
                });

                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'assets'
                    });
                }
            });

            this.fixedAssets.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'assets'
                        });
                    }
                });
                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'assets'
                    });
                }
            });

            this.equity.forEach(function (el) {
                el.root.forEach(function (elem) {
                    if (!uniqObbj[elem._id]) {
                        uniqObbj[elem._id] = true;

                        asyncKeys.push({
                            _id  : elem._id,
                            group: 'equity'
                        });
                    }
                });

                if (!uniqObbj[el.categoryId]) {
                    uniqObbj[el.categoryId] = true;

                    asyncKeys.push({
                        _id  : el.categoryId,
                        group: 'equity'
                    });
                }
            });

            this.$el.find('#listTableLiabilities').html('');
            this.$el.find('#listTableCurrentAssets').html('');
            this.$el.find('#listTableFixedAssets').html('');
            this.$el.find('#listTableEquity').html('');
            this.$el.find('#currentEarningsFooter').find('.money').html('');

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
