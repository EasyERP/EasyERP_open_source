define([
    'Backbone',
    'Underscore',
    'text!templates/JobPositions/list/ListTemplate.html'
], function (Backbone, _, ListTemplate) {
    'use strict';

    var JobPositionsListItemView = Backbone.View.extend({
        el        : '#listTable',
        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                jobPositionsCollection: this.collection.toJSON(),
                //startNumber           : this.startNumber
            }));
        }
    });
    return JobPositionsListItemView;
});
