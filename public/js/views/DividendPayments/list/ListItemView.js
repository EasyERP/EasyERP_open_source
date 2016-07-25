define([
    'Backbone',
    'Underscore',
    'text!templates/DividendPayments/list/ListTemplate.html',
    'helpers'
], function (Backbone, _, PaymentListTemplate, helpers) {
    var PaymentListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(PaymentListTemplate, {
                paymentCollection: this.collection.toJSON(),
                //startNumber      : this.startNumber,
                currencySplitter : helpers.currencySplitter,
                currencyClass    : helpers.currencyClass
            }));
        }
    });

    return PaymentListItemView;
});
