define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/contractJobs/list/ListHeader.html',
    'views/contractJobs/list/ListItemView',
    'collections/contractJobs/filterCollection',
    'models/InvoiceModel',
    'views/salesInvoices/EditView',
    'custom'
], function ($, _, ListViewBase, listTemplate, ListItemView, contentCollection, InvoiceModel, EditView, custom) {
    'use strict';
    var EmployeesListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        hasPagination    : true,
        contentType      : 'contractJobs',

        events: {
            'click .invoice': 'showInvoice',
            'click #sortBy' : 'openSortDrop'
        },

        initialize: function (options) {
            var dateRange;

            this.startTime = options.startTime;
            this.collection = options.collection;

            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.filter = options.filter || custom.retriveFromCash('contractJobs.filter');

            if (!this.filter) {
                this.filter = {};
            }

            dateRange = this.filter.date ? this.filter.date.value : [];

            if (!this.filter.date) {
                this.filter.date = {
                    value: [new Date(dateRange.startDate), new Date(dateRange.endDate)]
                };

            }

            options.filter = this.filter;

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            custom.cacheToApp('contractJobs.filter', this.filter);

            ListViewBase.prototype.initialize.call(this, options);
        },

        goSort: function (e) {
            var filter = this.filter || custom.retriveFromCash('contractJobs.filter');
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;
            var data;
            var el = 'th';

            this.startTime = new Date();

            if ($(e.target).closest('th') && $(e.target).closest('th').length) {
                target$ = $(e.target).closest('th');
            } else {
                target$ = $(e.target).closest('li');
                el = 'li';
            }

            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort').split(' ');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                    target$.parent().find(el).removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    target$.parent().find(el).removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                    break;
                // skip default case
            }

            sortBy.forEach(function (sortField) {
                sortObject[sortField] = sortConst;
            });

            data = {
                sort: sortObject
            };

            this.sort = sortObject;

            data.filter = filter;

            if (this.viewType) {
                data.viewType = this.viewType;
            }
            if (this.parrentContentId) {
                data.parrentContentId = this.parrentContentId;
            }
            if (this.contentType) {
                data.contentType = this.contentType;
            }

            data.page = 1;

            this.changeLocationHash(null, this.collection.pageSize);
            this.collection.getFirstPage(data);
        },

        openSortDrop: function (e) {
            var $target = $(e.target);

            e.preventDefault();

            $target.closest('.dropDown').toggleClass('open');
        },

        showInvoice: function (e) {
            var $target = $(e.target);
            var id = $target.attr('data-id');
            var model = new InvoiceModel({validate: false});

            model.urlRoot = '/Invoices';
            model.fetch({
                data: {
                    id      : id,
                    forSales: true,
                    viewType: 'form'
                },

                success: function (model) {
                    return new EditView({model: model});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
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

            searchObject = {
                filter: this.filter
            };

            this.collection.getPage(1, searchObject);

            App.filtersObject.filter = this.filter;

            custom.cacheToApp('contractJobs.filter', this.filter);
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $('#itemsNumber').text();

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.getPage(1, {
                count    : itemsNumber,
                page     : 1,
                filter   : filter
            });
        },

        showMoreContent: function (newModels) {
            this.$el.find('#listTable').html('');
            this.$el.append(new this.ListItemView({
                collection : newModels,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());
        },

        render: function () {
            var $currentEl;

            $('.ui-dialog ').remove();
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());
        }

    });

    return EmployeesListView;
});
