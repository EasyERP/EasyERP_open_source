define([
    'Backbone',
    'Underscore',
    'text!templates/Proforma/ListTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    'use strict';

    var InvoiceListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function (options) {
            var el = (options && options.thisEl) ? options.thisEl : this.$el;

            el.append(_.template(listTemplate, {
                collection      : this.collection.toJSON(),
                startNumber     : this.startNumber,
                currencySplitter: helpers.currencySplitter
            }));
        }
    });

    return InvoiceListItemView;
});
