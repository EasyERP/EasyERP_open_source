define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/manufacturingOrders/list/ListItemTemplate.html'
], function (Backbone, _, $, ItemTemplate) {
    var View = Backbone.View.extend({
        el: '#listContainer',

        itemTemplate: _.template(ItemTemplate),

        initialize: function (options) {
            this.collection = options.collection;

            this.render();
        },

        render: function () {
            var data = this.collection.toJSON();

            this.$el.html(this.itemTemplate({data: data}));

            return this;
        }
    });

    return View;
});