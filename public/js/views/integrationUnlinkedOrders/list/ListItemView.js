define([
    'Backbone',
    'Underscore',
    'text!templates/integrationUnlinkedOrders/list/ListTemplate.html',
    'helpers'
], function (Backbone, _, listTemplate, helpers) {
    var unlinkedListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                unlinkedOrders  : this.collection.toJSON(),
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));
        }
    });

    return unlinkedListItemView;
});
