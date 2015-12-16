define([
        'text!templates/salesQuotation/list/ListTemplate.html',
        'text!templates/salesQuotation/wTrack/ListTemplate.html'
    ],

    function (listTemplate, listForWTrack) {
        var QuotationListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render    : function () {
                if (App.weTrack) {
                    this.$el.append(_.template(listForWTrack, {
                        quotations : this.collection.toJSON(),
                        startNumber: this.startNumber
                    }));

                } else {
                    this.$el.append(_.template(listTemplate, {
                        quotations : this.collection.toJSON(),
                        startNumber: this.startNumber
                    }));

                }
            }
        });

        return QuotationListItemView;
    });
