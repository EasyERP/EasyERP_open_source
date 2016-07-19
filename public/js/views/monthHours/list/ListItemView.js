define([
    'Backbone',
    'Underscore',
    'text!templates/monthHours/list/listTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    'use strict';

    var monthHoursListItemView = Backbone.View.extend({
        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {
                monthHoursCollection: collect,
                //startNumber         : this.startNumber,
                currencySplitter    : helpers.currencySplitter
            }));
        }
    });

    return monthHoursListItemView;
});
