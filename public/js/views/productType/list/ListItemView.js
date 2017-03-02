define([
    'Backbone',
    'Underscore',
    'text!templates/productType/list/ListTemplate.html'
], function (Backbone, _, ListTemplate) {
    'use strict';

    var SettingsProductsTypesListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            //this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                productTypesCollection: this.collection.toJSON()
                //startNumber    : this.startNumber
            }));
        }
    });

    return SettingsProductsTypesListItemView;
});
