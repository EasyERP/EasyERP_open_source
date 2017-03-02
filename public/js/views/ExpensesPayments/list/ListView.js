define([
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/ExpensesPayments/list/ListHeader.html',
    'views/customerPayments/EditView',
    'models/PaymentModel',
    'views/ExpensesPayments/list/ListItemView',
    'views/ExpensesPayments/list/ListTotalView',
    'views/listViewBase',
    'helpers'
], function ($,
             _,
             paginationTemplate,
             listTemplate,
             EditView,
             currentModel,
             ListItemView,
             ListTotalView,
             ListViewBase,
             helpers) {
    'use strict';

    var PaymentListView = ListViewBase.extend({
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : 'ExpensesPayments',
        changedModels: {},
        responseObj  : {},

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;

            this.render();
        },

        events: {
            'click td:not(.notForm)': 'editItem'
        },

        editItem: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.get(id);

            e.preventDefault();
            e.stopPropagation();

            return new EditView({model: model});
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
            $currentEl.append(this.listTemplate);
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
            
            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + 'ms</div>');
        }
    });

    return PaymentListView;
});
