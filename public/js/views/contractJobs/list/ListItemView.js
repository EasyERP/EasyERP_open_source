define([
    'Backbone',
    'Underscore',
    'text!templates/contractJobs/list/ListTemplate.html',
    'helpers',
    'common'
], function (Backbone, _, ListTemplate, helpers, common) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                collection        : this.collection.toJSON(),
                currencySplitter  : helpers.currencySplitter,
                currencyClass     : helpers.currencyClass,
                utcDateToLocaleDate : common.utcDateToLocaleDate
            }));
        }
    });

    return ListItemView;
});
