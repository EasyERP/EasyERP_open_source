define([
        'Backbone',
        'Underscore',
        'text!templates/salesInvoice/list/ListTemplate.html',
        'helpers',
        'moment'
    ],

    function (Backbone, _, listTemplate, helpers) {
        var InvoiceListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.page = parseInt(options.page) ? parseInt(options.page) : 1;
                this.startNumber = (this.page - 1 ) * options.itemsNumber;
            },
            render    : function (options) {
                var el = (options && options.thisEl) ? options.thisEl : this.$el;

                el.append(_.template(listTemplate, {
                    invoiceCollection: this.collection.toJSON(),
                    startNumber      : this.startNumber,
                    currencySplitter : helpers.currencySplitter,
                    currencyClass    : helpers.currencyClass
                }));
            }
        });

        return InvoiceListItemView;
    });
