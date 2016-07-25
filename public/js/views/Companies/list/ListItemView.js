define([
    'Backbone',
    'Underscore',
    'text!templates/Companies/list/ListTemplate.html'
], function (Backbone, _, CompaniesListTemplate) {
    'use strict';

    var CompaniesListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(CompaniesListTemplate, {
                companiesCollection: this.collection.toJSON(),
                //startNumber        : this.startNumber
            }));

            return this;
        }
    });

    return CompaniesListItemView;
});
