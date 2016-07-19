define([
    'Backbone',
    'Underscore',
    'text!templates/Holiday/list/ListTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';

    var HolidayListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            var result = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {holidayCollection: result}));
        }
    });

    return HolidayListItemView;
});
