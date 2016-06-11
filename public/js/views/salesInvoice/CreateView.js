define([
    'views/Invoice/CreateView'
], function (CreateView) {
    var salesInvoice = CreateView.extend({
        forSales: true
    });

    return salesInvoice;
});
