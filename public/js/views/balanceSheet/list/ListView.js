define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/balanceSheet/list/ListHeader.html',
    'views/balanceSheet/list/ListItemView',
    'views/Filter/filterView',
    'views/journalEntry/ViewSource',
    'collections/balanceSheet/filterCollection',
    'models/InvoiceModel',
    'models/jobsModel',
    'models/EmployeesModel',
    'models/PaymentModel',
    'constants',
    'dataService',
    'helpers',
    'custom',
    'async',
    'common'
], function ($, _, listViewBase, listTemplate, ListItemView, FilterView, View, reportCollection, InvoiceModel, JobsModel, EmployeesModel, PaymentModel, CONSTANTS, dataService, helpers, custom, async, common) {
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
        JobsModel         : JobsModel,
        InvoiceModel      : InvoiceModel,
        PaymentModel      : PaymentModel,
        EmployeesModel    : EmployeesModel,
        responseObj       : {},

        events: {
            'click .mainTr'                                    : 'showHidden',
            'click .subTr'                                     : 'showHiddenSurtrs',
            //'click .childTr'                                   : 'showHiddenSub',
            'click .newSelectList li:not(.miniStylePagination)': 'viewSourceDocument',
            'click .current-selected'                          : 'showNewSelect'
        },

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
            /*dateRange = custom.retriveFromCash('balanceSheetDateRange');*/

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

            /*if (!this.filter.startDate) {
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
             this.endDate = new Date(this.filter.endDate.value);*/

            this.render();

            this.responseObj['#source'] = [
                {
                    _id : 'source',
                    name: 'View Source Document'
                }
            ];
        },

        viewSourceDocument: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var closestSpan = $target.closest('.current-selected');
            var dataId = closestSpan.attr('data-id');
            var dataName = closestSpan.attr('data-name');
            var dataEmployee = closestSpan.attr('data-employee');
            var model;
            var data;

            App.startPreload();

            if (this.selectView) {
                this.selectView.remove();
            }

            switch (dataName) {
                case 'wTrack':
                    model = new this.JobsModel();
                    data = {
                        employee: dataEmployee,
                        _id     : dataId
                    };

                    model.urlRoot = '/journalEntries/jobs';
                    break;
                case 'expensesInvoice':
                case 'dividendInvoice':
                case 'Invoice':
                    model = new this.InvoiceModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/invoices';

                    break;
                case 'Proforma':
                    model = new this.InvoiceModel();
                    data = {
                        _id     : dataId,
                        proforma: true
                    };

                    model.urlRoot = '/journalEntries/invoices';

                    break;
                case 'jobs':
                    model = new this.JobsModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/jobs';

                    break;
                case 'Payment':
                    model = new this.PaymentModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/payments';

                    break;
                case 'Employees':
                    model = new this.EmployeesModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/employees';

                    break;

                // skip default;
            }

            if (model) {
                model.fetch({
                    data   : data,
                    success: function (model) {
                        new View({model: model, type: dataName, employee: dataEmployee});

                        App.stopPreload();
                    },

                    error: function () {
                        App.stopPreload();

                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
            } else {
                App.stopPreload();

                App.render({
                    type   : 'notify',
                    message: 'No Source Document is required'
                });
            }

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

            //  childTr.find('[data-level=' + level + ']');
            /*[data-level='" + level + "']*/
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

        /*showHiddenSub: function (e, target, hide) {
         var $target = e ? $(e.target) : null;
         var $tr = $target ? $target.closest('tr') : target;
         var dataId = $tr.attr('data-ident');
         var $body = this.$el;
         var childTr = $body.find("[data-id='" + dataId + "']");
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

         },*/

        asyncRenderInfo: function (asyncKeys) {
            var self = this;
            var body = this.$el;

            async.each(asyncKeys, function (asyncId) {
                dataService.getData('journalEntries/getAsyncDataForGL', {
                    category : asyncId._id,
                    filter: self.filter
                }, function (result) {
                    var journalEntries = result.journalEntries;
                    var mainTr = body.find("[data-ident='" + asyncId._id + "']");
                    var subTrs = body.find("[data-main='" + asyncId._id + "'], [data-id='" + asyncId._id + "'], [data-category='" + asyncId._id + "'], [data-parent='" + asyncId._id + "']").not('.mainTr');

                    subTrs.find('.subTr, .childTr');

                    if (!mainTr.length) {
                        mainTr = body.find("[data-id='" + (asyncId._id + asyncId.group) + "']");
                    }

                    if (!journalEntries.length && !subTrs.length) {
                        // mainTr.removeClass('mainTr, subTr');
                        mainTr.find('td.expand').html('');
                    }
                    journalEntries.forEach(function (entry) {
                        mainTr.after("<tr data-parent='" + entry.category + "'data-category='" + (asyncId._id + asyncId.group) + "' data-main='" + asyncId._id + "' class='childTr hidden'><td></td><td class='leftBorderNone source'><span id='source' class='current-selected icon-caret-down' data-id='" + entry.sourceDocument._id + "' data-name='" + entry.sourceDocument.model + "' data-employee='" + entry.sourceDocument.employee + "'>" + entry.sourceDocument.name + '</span></td><td>' + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td class='money'>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + '</td><td></td></tr>');
                    });
                });

            });

        },

        changeDateRange: function (dateArray) {
            /* var stDate = $('#startDate').val();
             var enDate = $('#endDate').val();*/
            var searchObject;

            /*this.startDate = new Date(stDate);
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
             };*/

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

            this.$el.find('#listTableAssets').html('');
            this.$el.find('#listTableLiabilities').html('');
            this.$el.find('#listTableEquity').html('');

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
                el.root.forEach(function (elem) {
                    asyncKeys.push({
                        _id  : elem._id,
                        group: 'liabilities'
                    });
                });

                asyncKeys.push({
                    _id  : el.categoryId,
                    group: 'liabilities'
                });
            });

            this.assets.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push({
                        _id  : elem._id,
                        group: 'assets'
                    });
                });

                asyncKeys.push({
                    _id  : el.categoryId,
                    group: 'assets'
                });
            });

            this.equity.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push({
                        _id  : elem._id,
                        group: 'equity'
                    });
                });

                asyncKeys.push({
                    _id  : el.categoryId,
                    group: 'equity'
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

            this.liabilities.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push({
                        _id  : elem._id,
                        group: 'liabilities'
                    });
                });

                asyncKeys.push({
                    _id  : el.categoryId,
                    group: 'liabilities'
                });
            });

            this.assets.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push({
                        _id  : elem._id,
                        group: 'assets'
                    });
                });

                asyncKeys.push({
                    _id  : el.categoryId,
                    group: 'assets'
                });
            });

            this.equity.forEach(function (el) {
                el.root.forEach(function (elem) {
                    asyncKeys.push({
                        _id  : elem._id,
                        group: 'equity'
                    });
                });

                asyncKeys.push({
                    _id  : el.categoryId,
                    group: 'equity'
                });
            });

            this.$el.find('#listTableLiabilities').html('');
            this.$el.find('#listTableAssets').html('');
            this.$el.find('#listTableEquity').html('');

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
