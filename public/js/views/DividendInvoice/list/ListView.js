define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/DividendInvoice/list/ListHeader.html',
    'views/DividendInvoice/CreateView',
    'views/DividendInvoice/EditView',
    'models/InvoicesModel',
    'views/DividendInvoice/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'common',
    'dataService',
    'constants',
    'helpers'
], function ($, _, listViewBase, listTemplate, CreateView, EditView, invoiceModel, ListItemView, contentCollection, common, dataService, CONSTANTS, helpers) {
    'use strict';

    var InvoiceListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'DividendInvoice',
        changedModels    : {},
        hasPagination    : true,
        baseFilter       : {
            name : 'forSales',
            value: {
                key  : 'forSales',
                type : 'boolean',
                value: [false]
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
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            listViewBase.prototype.initialize.call(this, options);
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

        render: function () {
            var self;
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            function currentEllistRenderer(self) {
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

            // self.renderPagination($currentEl, self);
            /*self.renderFilter(self, {
             name : 'forSales',
             value: {
             key  : 'forSales',
             value: [false]
             }
             });*/

            this.recalcTotal();

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

        },

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'paid', 'total'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    if (model && model.currency && model.currency.rate) {
                        sum += parseFloat(model.paymentInfo[col] / model.currency.rate);
                    } else {
                        sum += parseFloat(model.paymentInfo[col]);
                    }
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new invoiceModel({validate: false});
            var self = this;

            if ($(e.target).closest('tfoot').length) {
                return;
            }

            e.preventDefault();

            model.urlRoot = '/invoices/';
            model.fetch({
                data: {
                    viewType   : 'form',
                    id         : id,
                    currentDb  : App.currentDb,
                    forSales   : 'false',
                    contentType: self.contentType
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

