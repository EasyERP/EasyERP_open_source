define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/profitAndLoss/list/ListHeader.html',
    'views/profitAndLoss/list/ListItemView',
    'views/Filter/filterView',
    'views/journalEntry/ViewSource',
    'collections/profitAndLoss/filterCollection',
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
        contentType       : CONSTANTS.PROFITANDLOSS, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        yearElement       : null,
        FilterView        : FilterView,
        responseObj       : {},
        JobsModel         : JobsModel,
        InvoiceModel      : InvoiceModel,
        PaymentModel      : PaymentModel,
        EmployeesModel    : EmployeesModel,

        events: {
            'click .mainTr'                                    : 'showHidden',
            'click .newSelectList li:not(.miniStylePagination)': 'viewSourceDocument',
            'click .current-selected'                          : 'showNewSelect'
        },

        initialize: function (options) {
            var dateRange;
            var jsonCollection;

            this.startTime = options.startTime;
            this.collection = options.collection;
            jsonCollection = this.collection.toJSON();
            this.grossFit = jsonCollection[0] ? jsonCollection[0].grossFit : [];
            this.expenses = jsonCollection[0] ? jsonCollection[0].expenses : [];
            this.dividends = jsonCollection[0] ? jsonCollection[0].dividends : 0;
            _.bind(this.collection.showMore, this.collection);
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.page;
            dateRange = custom.retriveFromCash('profitAndLossDateRange');

            this.filter = options.filter || custom.retriveFromCash('profitAndLoss.filter');

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
            custom.cacheToApp('profitAndLoss.filter', this.filter);

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
                        mainTr.after("<tr data-main='" + asyncId + "' class='hidden childRow'><td></td><td class='leftBorderNone source'><span id='source' class='current-selected icon-caret-down' data-id='" + entry.sourceDocument._id + "' data-name='" + entry.sourceDocument.model + "' data-employee='" + entry.sourceDocument.employee + "'>" + entry.sourceDocument.name + '</span></td><td>' + common.utcDateToLocaleFullDateTime(entry._id) + "</td><td class='money textRight'>" + (entry.debit ? helpers.currencySplitter((entry.debit / 100).toFixed(2)) : helpers.currencySplitter((entry.credit / 100).toFixed(2))) + '</td></tr>');
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

            custom.cacheToApp('profitAndLoss.filter', this.filter);
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var collection;
            var itemView;
            var asyncKeys = [];

            this.$el.find('#listTableGrossFit').html('');
            this.$el.find('#listTableExpenses').html('');

            collection = newModels.toJSON();

            this.grossFit = collection[0].grossFit;
            this.expenses = collection[0].expenses;
            this.dividends = collection[0].dividends;

            itemView = new ListItemView({
                collection      : collection,
                currencySplitter: helpers.currencySplitter
            });

            $currentEl.append(itemView.render());

            this.expenses.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.grossFit.forEach(function (el) {
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
            var self = this;
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

            this.grossFit.forEach(function (el) {
                asyncKeys.push(el._id);
            });

            this.$el.find('#listTableExpenses').html('');
            this.$el.find('#listTableGrossFit').html('');

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
