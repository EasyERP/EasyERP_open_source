define([
    'Underscore',
    'jQuery',
    'views/listViewBase',
    'text!templates/journalEntry/list/ListHeader.html',
    'views/journalEntry/list/ListItemView',
    'views/salesInvoices/EditView',
    'views/DividendInvoice/EditView',
    'models/InvoiceModel',
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
             EditView,
             DividendEditView,
             InvoiceModel,
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

        initialize: function (options) {
            var dateRange = custom.retriveFromCash('journalEntryDateRange');

            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.filter = options.filter || custom.retriveFromCash('journalEntry.filter');

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

            custom.cacheToApp('journalEntry.filter', this.filter);
        },

        events: {
            'click .Invoice, .dividendInvoice': 'viewSourceDocument',
            'click .jobs'                     : 'viewSourceDocumentJOb'
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

            this.filter.startDate = {
                key  : 'startDate',
                value: stDate
            };

            this.filter.endDate = {
                key  : 'endDate',
                value: enDate
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

        viewSourceDocument: function (e) {
            var $target = $(e.target);
            var id = $target.attr('data-id');
            var forSales = $target.attr('class') !== 'dividendInvoice';
            var View = EditView;
            var model = new InvoiceModel({validate: false});

            if (!forSales) {
                View = DividendEditView;
            }

            model.urlRoot = '/Invoices/form';
            model.fetch({
                data: {
                    id         : id,
                    currentDb  : App.currentDb,
                    contentType: $target.attr('class'),
                    forSales   : forSales.toString()
                },

                success: function (model) {
                    new View({model: model, redirect: true, notCreate: true});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
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

            // this.renderFilter();

            if (!this.filterView) {
                if (!App || !App.filtersObject || !App.filtersObject.filtersValues || !App.filtersObject.filtersValues[this.contentType]) {
                    custom.getFiltersValues({contentType: this.contentType}, this.renderFilter(this.baseFilter));
                } else {
                    this.renderFilter(this.baseFilter);
                }
            }

            this.renderPagination($currentEl, this);

            App.filtersObject.filter = this.filter;

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }
    });

    return ListView;
});
