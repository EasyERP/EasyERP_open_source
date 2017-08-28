define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/ExpensesInvoice/list/ListHeader.html',
    'views/ExpensesInvoice/CreateView',
    'views/ExpensesInvoice/form/EditView',
    'models/InvoicesModel',
    'views/ExpensesInvoice/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'helpers'
], function (Backbone, $, _, listViewBase, listTemplate, CreateView, EditView, InvoiceModel, ListItemView, contentCollection, helpers) {
    'use strict';

    var InvoiceListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'ExpensesInvoice',
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

            this.formUrl = 'easyErp/' + this.contentType + '/tform/';


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

            this.recalcTotal();
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
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (!id || $(e.target).closest('tfoot').length) {
                return;
            }

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;

            Backbone.history.navigate(url, {trigger: true});
        }

        /*gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            if ($(e.target).closest('tfoot').length) {
                return;
            }

            e.preventDefault();

            model.urlRoot = '/invoice';
            model.fetch({
                data: {
                    id       : id,
                    viewType : 'form',
                    currentDb: App.currentDb,
                    forSales : 'false',
                    contentType: 'expensesInvoice'
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
        }*/

    });

    return InvoiceListView;
});
