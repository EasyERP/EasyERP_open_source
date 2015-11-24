/**
 * Created by soundstorm on 27.05.15.
 */
define([
    'views/Quotation/CreateView',
        "models/QuotationModel"
],
function(CreateView, QuotationModel) {
    var salesQuotation = CreateView.extend({
        forSales: true,
        responseObj: {},

        initialize: function(){
            this.forSales = true;
            this.model = new QuotationModel();
            this.render();
        }
    });

    return salesQuotation;
});