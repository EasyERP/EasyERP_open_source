define([
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'text!templates/journalEntry/list/ListHeader.html',
    'views/journalEntry/list/ListItemView',
    'views/selectView/selectView',
    'views/journalEntry/ViewSource',
    'models/InvoiceModel',
    'models/jobsModel',
    'models/EmployeesModel',
    'models/PaymentModel',
    'collections/journalEntry/filterCollection',
    'constants',
    'helpers',
    'dataService',
    'common',
    'moment',
    'custom'
], function (_,
             $,
             ListViewBase,
             listTemplate,
             ListItemView,
             SelectView,
             View,
             InvoiceModel,
             JobsModel,
             EmployeesModel,
             PaymentModel,
             contentCollection,
             CONSTANTS,
             helpers,
             dataService,
             common,
             moment,
             custom) {

    'use strict';

    var ListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.JOURNALENTRY,
        exportToXlsxUrl  : 'journalEntries/exportToXlsx',
        exportToCsvUrl   : 'journalEntries/exportToCsv',
        hasPagination    : true,
        responseObj      : {},
        JobsModel        : JobsModel,
        InvoiceModel     : InvoiceModel,
        PaymentModel     : PaymentModel,
        EmployeesModel   : EmployeesModel,

        events: {
            'click .newSelectList li:not(.miniStylePagination)': 'viewSourceDocument',
            'click .current-selected'                          : 'showNewSelect'
        },

        initialize: function (options) {
            var dateRange;

            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;
            this.totalValue = options.collection.totalValue;

            this.filter = options.filter || custom.retriveFromCash('journalEntry.filter');

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

            options.filter = this.filter;

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            ListViewBase.prototype.initialize.call(this, options);

            custom.cacheToApp('journalEntry.filter', this.filter);

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

        changeDateRange: function () {
            var itemsNumber = $('#itemsNumber').text();
            var stDate = $('#startDate').val();
            var enDate = $('#endDate').val();
            var searchObject;

            this.startDate = new Date(stDate);
            this.endDate = new Date(enDate);

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: [this.startDate, this.endDate]
            };

            searchObject = {
                page     : 1,
                startDate: stDate,
                endDate  : enDate,
                filter   : this.filter
            };

            this.collection.getFirstPage(searchObject);
            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('journalEntry.filter', this.filter);
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $('#itemsNumber').text();

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            custom.cacheToApp('journalEntry.filter', this.filter);

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.getFirstPage({
                count    : itemsNumber,
                page     : 1,
                filter   : filter,
                startDate: this.startDate,
                endDate  : this.endDate
            });
        },

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });

            dataService.getData('journalEntries/getReconcileDate', {}, function (result) {
                var newDate = moment(new Date());
                var date = moment(result.date);
                var same = false;

                $('#reconcileDate').text(common.utcDateToLocaleDate(result.date));

                if (newDate.isSame(date, 'month year date')) {
                    same = true;
                }

                if (same) {
                    $('#reconcileBtn').addClass('btnSuccess');
                } else {
                    $('#reconcileBtn').addClass('btnAttention');
                }

            });

            $currentEl.prepend(itemView.render());

            this.$el.find('#totalDebit').text(helpers.currencySplitter((this.totalValue / 100).toFixed(2)));

            App.filtersObject.filter = this.filter;
        }
    });

    return ListView;
});
