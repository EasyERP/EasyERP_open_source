define([
    'Backbone',
    'Underscore',
    'text!templates/cashTransfer/list/ListTemplate.html',
    'helpers',
    'common'
], function (Backbone, _, cashTransferTemplate, helpers, common) {
    'use strict';
    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(cashTransferTemplate, {
                collection         : this.collection.toJSON(),
                startNumber        : this.startNumber,
                currencySplitter   : helpers.currencySplitter,
                currencyClass      : helpers.currencyClass,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));
        }
    });
    return ListItemView;
});
