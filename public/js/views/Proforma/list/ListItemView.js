define([
        'text!templates/Proforma/ListTemplate.html',
        'helpers'
    ],

    function (listTemplate, helpers) {
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
                    collection       : this.collection.toJSON(),
                    startNumber      : this.startNumber,
                    currencySplitter : helpers.currencySplitter
                }));
            }
        });

        return InvoiceListItemView;
    });
