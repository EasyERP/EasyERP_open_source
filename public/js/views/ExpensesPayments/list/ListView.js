define([
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/ExpensesPayments/list/ListHeader.html',
    'text!templates/ExpensesPayments/list/ListHeader.html',
    'text!templates/supplierPayments/list/cancelEdit.html',
    'views/selectView/selectView',
    'views/supplierPayments/CreateView',
    'views/Filter/filterView',
    'models/PaymentModel',
    'views/ExpensesPayments/list/ListItemView',
    'views/ExpensesPayments/list/ListTotalView',
    'collections/ExpensesPayments/filterCollection',
    'collections/ExpensesPayments/editCollection',
    'dataService',
    'populate',
    'async',
    'helpers/keyCodeHelper',
    'views/listViewBase',
    'helpers'
], function ($,
             _,
             paginationTemplate,
             listTemplate,
             ListHeaderForWTrack,
             cancelEdit,
             selectView,
             CreateView,
             FilterView,
             currentModel,
             ListItemView,
             ListTotalView,
             paymentCollection,
             EditCollection,
             dataService,
             populate,
             async,
             keyCodes,
             ListViewBase,
             helpers) {
    'use strict';

    var PaymentListView = ListViewBase.extend({
        CreateView   : CreateView,
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : 'ExpensesPayments',
        changedModels: {},
        responseObj  : {},

        initialize: function (options) {
            $(document).off('click');

            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = paymentCollection;

            this.render();
        },

        recalcTotal: function () {
            var paid = 0;
            var amount = 0;

            _.each(this.collection.toJSON(), function (model) {
                paid += parseFloat(model.paid);
                amount += parseFloat(model.paidAmount);
            });

            this.$el.find('#totalPaid').text(helpers.currencySplitter(paid.toFixed(2)));
            this.$el.find('#totalAmount').text(helpers.currencySplitter(amount.toFixed(2)));
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(ListHeaderForWTrack));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            $currentEl.append(new ListTotalView({
                element : this.$el.find('#listTable'),
                cellSpan: 3,
                wTrack  : true
            }).render());

            self.renderFilter(self);

            self.renderPagination($currentEl, self);

            setTimeout(function () {
                self.editCollection = new EditCollection(self.collection.toJSON());
                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#listTable');
            }, 10);

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + 'ms</div>');
        }
    });

    return PaymentListView;
});
