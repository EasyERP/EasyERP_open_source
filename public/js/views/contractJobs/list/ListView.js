define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/contractJobs/list/ListHeader.html',
    'views/contractJobs/list/ListItemView',
    'collections/contractJobs/filterCollection',
    'models/InvoiceModel',
    'views/salesInvoices/EditView'
], function ($, _, ListViewBase, listTemplate, ListItemView, contentCollection, InvoiceModel, EditView) {
    'use strict';
    var EmployeesListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        hasPagination    : true,
        contentType      : 'contractJobs',

        events: {
            'click .invoice': 'showInvoice'
        },

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);
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
