define([
    'Backbone',
    'Underscore',
    'text!templates/stockCorrections/list/listTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';

    var bonusTypeListItemView = Backbone.View.extend({

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
                collection: collect
                //startNumber: this.startNumber
            }));
        }
    });

    return bonusTypeListItemView;
});
