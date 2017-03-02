define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/WriteOff/list/ListHeader.html',
    'views/WriteOff/CreateView',
    'views/WriteOff/EditView',
    'models/InvoiceModel',
    'views/WriteOff/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'helpers'
], function ($, _, listViewBase, listTemplate, CreateView, EditView, InvoiceModel, ListItemView, contentCollection, helpers) {
    'use strict';

    var WriteOffListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'WriteOff',
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
            var id;
            var self = this;
            var keys = Object.keys(this.changedModels);
            var i;

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
            var itemView;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            $currentEl.append(_.template(listTemplate, {currentDb: true}));
            itemView = new ListItemView({
                collection : self.collection,
                page       : self.page,
                itemsNumber: self.collection.namberToShow
            });
            itemView.bind('incomingStages', self.pushStages, self);

            $currentEl.append(itemView.render());

            // self.renderPagination($currentEl, self);
            // self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [false]}});

            this.recalcTotal();

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + 'ms</div>');
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

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            e.preventDefault();

            if ($(e.target).closest('tfoot').length) {
                return;
            }

            model.urlRoot = '/Invoices';
            model.fetch({
                data: {
                    id         : id,
                    viewType   : 'form',
                    contentType: this.contentType,
                    currentDb  : App.currentDb,
                    forSales   : 'false'
                },

                success: function (response) {
                    return new EditView({model: response});
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

    return WriteOffListView;
});
