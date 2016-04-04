define([
        'text!templates/salesOrder/list/ListTemplate.html',
        'text!templates/salesOrder/wTrack/ListTemplate.html',
        'helpers'
    ],

    function (listTemplate, listForWTrack, helpers) {
        var OrderListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render    : function (options) {
                var el = (options && options.thisEl) ? options.thisEl : this.$el;

                el.append(_.template(listForWTrack, {
                    orderCollection: this.collection.toJSON(),
                    startNumber    : this.startNumber,
                    currencySplitter: helpers.currencySplitter
                }));
            }
        });

        return OrderListItemView;
    });
