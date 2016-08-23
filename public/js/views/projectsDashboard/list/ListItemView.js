define([
    'Backbone',
    'Underscore',
    'text!templates/projectsDashboard/list/ListTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                currencySplitter: helpers.currencySplitter,
                collection      : this.collection.toJSON()
            }));
        }
    });

    return ListItemView;
});
