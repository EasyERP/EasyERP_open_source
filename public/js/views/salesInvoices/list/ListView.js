define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesInvoices/list/ListHeader.html',
    'views/salesInvoices/CreateView',
    'views/salesInvoices/EditView',
    'models/InvoiceModel',
    'views/salesInvoices/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'views/Filter/filterView',
    'common',
    'dataService',
    'helpers',
    'constants'
], function ($,
             _,
             listViewBase,
             listTemplate,
             CreateView,
             EditView,
             InvoiceModel,
             ListItemView,
             contentCollection,
             FilterView,
             common,
             dataService,
             helpers,
             CONSTANTS) {
    'use strict';

    var InvoiceListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.SALESINVOICES,
        changedModels    : {},
        hasPagination    : true,
        baseFilter       : {
            name : 'forSales',
            value: {
                key  : 'forSales',
                value: [true]
            }
        },

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter ? options.filter : {};
            this.filter.forSales = {key: 'forSales', value: [true]};
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            listViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog'
        },

        saveItem: function () {
            var model;
            var self = this;
            var id;
            var i;
            var keys = Object.keys(this.changedModels);

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
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

            this.changedModels = {};

        },

        currentEllistRenderer: function (self) {
            var $currentEl = self.$el;
            var itemView;

            $currentEl.append(_.template(listTemplate, {currentDb: true}));
            itemView = new ListItemView({
                collection : self.collection,
                page       : self.page,
                itemsNumber: self.collection.namberToShow
            });

            $currentEl.append(itemView.render());
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            this.currentEllistRenderer(self);

            // self.renderPagination($currentEl, self);
            // self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [true]}});

            this.recalcTotal();

            // $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
        },

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'total', 'paid'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    if (col === 'paid') {
                        sum += parseFloat(model[col]);
                    } else {
                        sum += parseFloat(model.paymentInfo[col]);
                    }
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/invoices/';
            model.fetch({
                data: {
                    id       : id,
                    currentDb: App.currentDb,
                    viewType : 'form'
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
        }

    });

    return InvoiceListView;
});
