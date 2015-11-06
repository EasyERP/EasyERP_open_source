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
            render: function(options) {
                var el = (options && options.thisEl) ? options.thisEl : this.$el;

                if (App.weTrack){
                    el.append(_.template(listForWTrack, { orderCollection: this.collection.toJSON(), startNumber: this.startNumber }));
                } else {
                    el.append(_.template(listTemplate, { orderCollection: this.collection.toJSON(), startNumber: this.startNumber }));
                }
            }
        });

        return OrderListItemView;
    });
