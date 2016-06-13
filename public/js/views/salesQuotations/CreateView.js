define([
    'views/Quotations/CreateView',
    'models/QuotationModel'
], function (CreateView, QuotationModel) {
    var salesQuotation = CreateView.extend({
        forSales   : true,
        responseObj: {},

        initialize: function () {
            this.forSales = true;
            this.model = new QuotationModel();
            this.render();
        }
    });

    return salesQuotation;
});
