define([
    'text!templates/salesOrder/list/ListTemplate.html',
    'text!templates/salesOrder/wTrack/ListTemplate.html'
],

    function (listTemplate, listForWTrack) {
        var OrderListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function(options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render: function() {
                if (App.weTrack){
                    this.$el.append(_.template(listForWTrack, { orderCollection: this.collection.toJSON(), startNumber: this.startNumber }));
                } else {
                    this.$el.append(_.template(listTemplate, { orderCollection: this.collection.toJSON(), startNumber: this.startNumber }));
                }
            }
        });

        return OrderListItemView;
    });
