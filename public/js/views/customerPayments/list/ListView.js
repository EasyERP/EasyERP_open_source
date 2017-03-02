define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/customerPayments/list/ListHeader.html',
    'text!templates/customerPayments/list/cancelTemplate.html',
    'views/customerPayments/list/ListItemView',
    'views/customerPayments/EditView',
    'collections/customerPayments/filterCollection',
    'collections/customerPayments/editCollection',
    'models/PaymentModel',
    'dataService',
    'populate',
    'async',
    'helpers'
], function (Backbone, $, _, ListViewBase, listTemplate, cancelEdit, ListItemView, EditView, paymentCollection, EditCollection, CurrentModel, dataService, populate, async, helpers) {
    'use strict';

    var PaymentListView = ListViewBase.extend({

        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentType      : 'customerPayments', // needs in view.prototype.changeLocationHash
        modelId          : null,
        $listTable       : null,
        editCollection   : null,
        contentCollection: paymentCollection,
        changedModels    : {},
        responseObj      : {},
        template         : _.template(listTemplate),
        hasPagination    : true,

        events: {
            'click td.editable'                                : 'editRow',
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click td:not(.notForm)'                           : 'editItem'
        },

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CurrentModel = CurrentModel;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = paymentCollection;

            this.forSale = options.forSale;

            ListViewBase.prototype.initialize.call(this, options);
        },

        editItem: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.get(id);

            e.preventDefault();
            e.stopPropagation();

            return new EditView({model: model});
        },

        recalcTotal: function () {
            var amount = 0;

            _.each(this.collection.toJSON(), function (model) {
                amount += parseFloat(model.paidAmount);
            });

            this.$el.find('#totalPaidAmount').text(helpers.currencySplitter(amount.toFixed(2)));
        },

        render: function () {
            var self = this;
            var $currentEl;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(this.template);
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.recalcTotal();

            // this.renderPagination($currentEl, this);

            // this.renderFilter();

            this.editCollection = new EditCollection(this.collection.toJSON());

            this.$listTable = $('#listTable');

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + 'ms</div>');

            return this;
        }
    });

    return PaymentListView;
});
