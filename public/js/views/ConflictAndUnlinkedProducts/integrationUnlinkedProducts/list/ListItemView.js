define([
    'Backbone',
    'Underscore',
    'text!templates/integrationUnlinkedProducts/list/ListTemplate.html'
], function (Backbone, _, listTemplate) {
    var unlinkedListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.fromIntegration = options.fromIntegration;
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                unlinkedProducts: this.collection.toJSON(),
                fromIntegration : this.fromIntegration
            }));
        }
    });

    return unlinkedListItemView;
});
