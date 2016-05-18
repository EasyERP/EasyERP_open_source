define([
        'text!templates/Order/list/ListTemplate.html',
        'helpers'
    ],

    function (listTemplate, helpers) {
        var OrderListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = options.page ? parseInt(options.page, 10) : 1;
                this.startNumber = (this.page - 1) * options.itemsNumber;
            },
            render    : function () {
                this.$el.append(_.template(listTemplate, {
                    orderCollection: this.collection.toJSON(),
                    startNumber    : this.startNumber,
                    currencySplitter: helpers.currencySplitter
                }));
            }
        });

        return OrderListItemView;
    });
