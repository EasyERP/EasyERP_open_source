define([
    'jQuery',
    'underscore',
    'views/listViewBase',
    'text!templates/ExpensesInvoice/list/ListHeader.html',
    'views/ExpensesInvoice/CreateView',
    'views/ExpensesInvoice/EditView',
    'models/InvoiceModel',
    'views/ExpensesInvoice/list/ListItemView',
    'collections/salesInvoice/filterCollection',
    'views/Filter/FilterView',
    'common',
    'dataService',
    'constants',
    'helpers'
], function ($, _, listViewBase, listTemplate, CreateView, EditView, InvoiceModel, ListItemView, contentCollection, filterView, common, dataService, CONSTANTS, helpers) {
    'use strict';

    var InvoiceListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        filterView       : filterView,
        contentType      : 'ExpensesInvoice',
        changedModels    : {},

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog',
            'click .newSelectList li'                        : 'chooseOption',
            'click .selectList'                              : 'showSelects'
        },

        showSelects: function (e) {
            e.preventDefault();

            $(e.target).parent('td').append("<ul class='newSelectList'><li>Draft</li><li>Done</li></ul>");

            e.stopPropagation();
        },

        saveItem: function () {
            var model;
            var id;
            var self = this;

            for (id in this.changedModels) {
                model = this.collection.get(id);

                model.save({
                    validated: self.changedModels[id].validated
                }, {
                    headers: {
                        mid: 55
                    },

                    patch   : true,
                    validate: false,
                    success : function () {
                        $('#top-bar-saveBtn').hide();
                    }
                });
            }

            for (id in this.changedModels) {
                delete this.changedModels[id];
            }
        },

        chooseOption: function (e) {
            var target$ = $(e.target);
            var targetElement = target$.parents('td');
            var targetTr = target$.parents('tr');
            var id = targetTr.attr('data-id');

            if (!this.changedModels[id]) {
                this.changedModels[id] = {};
            }

            if (!this.changedModels[id].hasOwnProperty('validated')) {
                this.changedModels[id].validated = target$.text();
                this.changesCount++;
            }

            targetElement.find('.selectList').text(target$.text());

            this.hideNewSelect();

            $('#top-bar-saveBtn').show();
            return false;

        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            function currentEllistRenderer(self) {
                var itemView;

                $currentEl.append(_.template(listTemplate, {currentDb: true}));
                itemView = new ListItemView({
                    collection : self.collection,
                    page       : self.page,
                    itemsNumber: self.collection.namberToShow
                });
                itemView.bind('incomingStages', self.pushStages, self);

                $currentEl.append(itemView.render());

            }

            currentEllistRenderer(self);

            self.renderPagination($currentEl, self);
            self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [false]}});

            this.recalcTotal();

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + 'ms</div>');
        },

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'paid', 'total'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    sum += parseFloat(model.paymentInfo[col]);
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/Invoice';
            model.fetch({
                data: {
                    id       : id,
                    viewType : 'form',
                    currentDb: App.currentDb,
                    forSales : 'false'
                },

                success: function (model) {
                    new EditView({model: model});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        }

    });

    return InvoiceListView;
});

