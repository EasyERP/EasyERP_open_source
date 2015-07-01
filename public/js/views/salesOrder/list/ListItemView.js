define([
    'text!templates/salesOrder/list/ListTemplate.html'
],

    function (listTemplate) {
        var OrderListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function(options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render: function() {
                this.$el.append(_.template(listTemplate, { orderCollection: this.collection.toJSON(), startNumber: this.startNumber }));
            }
        });

        return OrderListItemView;
    });
