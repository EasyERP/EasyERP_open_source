define([
    'Backbone',
    'Underscore',
    'text!templates/invoice/list/ListTemplate.html',
    'helpers',
    'moment'
], function (Backbone, _, listTemplate, helpers) {
    var InvoiceListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize;// Counting the start index of list items
        },

        render: function (options) {
            var el = (options && options.thisEl) ? options.thisEl : this.$el;

            el.append(_.template(listTemplate, {
                invoiceCollection: this.collection.toJSON(),
                //startNumber      : this.startNumber,
                currencySplitter : helpers.currencySplitter,
                currencyClass    : helpers.currencyClass
            }));
        }
    });

    return InvoiceListItemView;
});
