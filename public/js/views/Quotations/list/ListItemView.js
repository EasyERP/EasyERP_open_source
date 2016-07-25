define([
    'Backbone',
    'Underscore',
    'text!templates/Quotations/list/ListTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    var QuotationListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize;// Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                quotations      : this.collection.toJSON(),
                //startNumber     : this.startNumber,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));
        }
    });

    return QuotationListItemView;
});
