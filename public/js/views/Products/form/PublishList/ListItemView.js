define([
    'Backbone',
    'Underscore',
    'text!templates/Products/form/PublishList/ListTemplate.html'
], function (Backbone, _, ListTemplate, populate) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listPublishTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.product = options.product;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                collection: this.collection.toJSON(),
                product   : this.product
            }));
        }
    });

    return ListItemView;
});
