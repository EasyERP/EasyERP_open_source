define([
        'text!templates/Quotation/list/ListTemplate.html',
        'helpers'
    ],

    function (listTemplate, helpers) {
        var QuotationListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;
            },
            render    : function () {
                this.$el.append(_.template(listTemplate, {
                    quotations : this.collection.toJSON(),
                    startNumber: this.startNumber,
                    currencySplitter: helpers.currencySplitter
                }));
            }
        });

        return QuotationListItemView;
    });
