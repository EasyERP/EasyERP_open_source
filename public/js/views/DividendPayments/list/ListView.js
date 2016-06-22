define([
    'jQuery',
    'Underscore',
    'text!templates/DividendPayments/list/ListTemplate.html',
    'text!templates/DividendPayments/list/ListHeader.html',
    'views/supplierPayments/CreateView',
    'models/PaymentModel',
    'views/DividendPayments/list/ListItemView',
    // 'views/DividendPayments/list/ListTotalView',
    'collections/DividendPayments/filterCollection',
    'views/listViewBase',
    'helpers'
], function ($, _,
             listTemplate,
             ListHeaderForWTrack,
             CreateView,
             CurrentModel,
             ListItemView,
             // ListTotalView,
             paymentCollection,
             ListViewBase,
             helpers) {
    var PaymentListView = ListViewBase.extend({
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : 'DividendPayments',
        changedModels: {},
        hasPagination: true,

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

            ListViewBase.prototype.initialize.call(this, options);
        },

        recalcTotal: function () {
            var sum = 0;

            _.each(this.collection.toJSON(), function (model) {
                if (model && model.currency && model.currency.rate) {
                    sum += parseFloat(model.paidAmount / model.currency.rate);
                } else {
                    sum += parseFloat(model.paidAmount);
                }
            });

            this.$el.find('#totalPaid').text(helpers.currencySplitter(sum.toFixed(2)));
        },

        render: function () {
            // var self = this;
            var $currentEl = this.$el;

            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(ListHeaderForWTrack));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            /* $currentEl.append(new ListTotalView({
             element : this.$el.find('#listTable'),
             cellSpan: 4,
             wTrack  : true
             }).render());*/

            // self.renderPagination($currentEl, self);

            this.recalcTotal();

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }
    });

    return PaymentListView;
});
