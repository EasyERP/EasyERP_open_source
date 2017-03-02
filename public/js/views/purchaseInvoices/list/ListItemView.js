define([
    'Backbone',
    'Underscore',
    'text!templates/purchaseInvoices/list/ListTemplate.html',
    'helpers',
    'moment'
], function (Backbone, _, listTemplate, helpers) {
    var InvoiceListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function (options) {
            var el = (options && options.thisEl) ? options.thisEl : this.$el;

            el.append(_.template(listTemplate, {
                invoiceCollection: this.collection.toJSON(),
                currencySplitter : helpers.currencySplitter,
                currencyClass    : helpers.currencyClass
            }));
        }
    });

    return InvoiceListItemView;
});
