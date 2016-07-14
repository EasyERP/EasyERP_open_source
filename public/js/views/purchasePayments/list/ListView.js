define([
    'jQuery',
    'views/customerPayments/list/ListView'
], function ($, CreateView) {
    var salesInvoice = CreateView.extend({
        forSale: false,

        initialize: function (options) {
            $(document).off('click');
            this.contentType = 'purchasePayments';
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;

            this.forSale = false;

            CreateView.prototype.initialize.call(this, options);
        }
    });

    return salesInvoice;
});
