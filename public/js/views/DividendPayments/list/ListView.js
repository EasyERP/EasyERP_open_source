define([
    'jQuery',
    'Underscore',
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/DividendPayments/list/ListTemplate.html',
    'text!templates/DividendPayments/list/ListHeader.html',
    'text!templates/supplierPayments/list/cancelEdit.html',
    'views/selectView/selectView',
    'views/supplierPayments/CreateView',
    'views/Filter/filterView',
    'models/PaymentModel',
    'views/DividendPayments/list/ListItemView',
    'views/DividendPayments/list/ListTotalView',
    'collections/DividendPayments/filterCollection',
    'collections/DividendPayments/editCollection',
    'dataService',
    'populate',
    'async',
    'helpers/keyCodeHelper',
    'views/listViewBase'
], function ($, _,
             paginationTemplate,
             listTemplate,
             ListHeaderForWTrack,
             cancelEdit,
             selectView,
             CreateView,
             FilterView,
             CurrentModel,
             ListItemView,
             ListTotalView,
             paymentCollection,
             EditCollection,
             dataService,
             populate,
             async,
             keyCodes,
             ListViewBase) {
    var PaymentListView = ListViewBase.extend({
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : 'DividendPayments',
        changedModels: {},

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
                cellSpan: 4,
                wTrack  : true
            }).render());

            self.renderPagination($currentEl, self);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }
    });

    return PaymentListView;
});
