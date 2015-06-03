/**
 * Created by soundstorm on 27.05.15.
 */
define([
    'views/Invoice/CreateView'
],
function(CreateView) {
    var salesInvoice = CreateView.extend({
        forSales: true
    });

    return salesInvoice;
})