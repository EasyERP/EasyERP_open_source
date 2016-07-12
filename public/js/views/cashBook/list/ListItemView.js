define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/cashBook/list/ListTemplate.html',
    'helpers',
    'common'
], function (Backbone, $, _, listTemplate, helpers, common) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '.containerContent',

        initialize: function (options) {
            this.collection = options.collection && options.collection[0] ? options.collection[0] : {};

            this.data = this.collection.data || [];
            this.accounts = this.collection.accounts || [];

            this.startDate = options.startDate;
            this.endDate = options.endDate;
        },

        render: function () {
            this.$el.find('#listTable').append(_.template(listTemplate, {
                collection         : this.data,
                accounts           : this.accounts,
                currencySplitter   : helpers.currencySplitter,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));

            return this;
        }
    });

    return ListItemView;
});
