define([
    'Backbone',
    'Underscore',
    'text!templates/Departments/list/ListTemplate.html'
], function (Backbone, _, ListTemplate) {
    'use strict';

    var DepartmentsListItemView = Backbone.View.extend({
        el        : '#listTable',
        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                departmentsCollection: this.collection.toJSON(),
                startNumber          : this.startNumber
            }));
        }
    });
    return DepartmentsListItemView;
});
