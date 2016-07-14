define([
    'views/customerPayments/list/ListView'
], function (CreateView) {
    var salesInvoice = CreateView.extend({
        forSale: false,

        initialize: function () {
            this.forSale = false;
            this.render();
        }
    });

    return salesInvoice;
});
