define([
    'Backbone',
    'Underscore',
    'text!templates/stockTransactions/list/listTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';

    var bonusTypeListItemView = Backbone.View.extend({

        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {
                collection: collect
            }));
        }
    });

    return bonusTypeListItemView;
});
