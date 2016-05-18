define([
        'text!templates/PayrollPayments/list/ListTemplate.html',
        'helpers'
    ],

    function (PaymentListTemplate, helpers) {
        var PaymentListItemView = Backbone.View.extend({
            el: '#listTable',

            initialize: function (options) {
                this.collection = options.collection;
                this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
            },
            render    : function () {
                this.$el.append(_.template(PaymentListTemplate, {
                    paymentCollection: this.collection.toJSON(),
                    startNumber      : this.startNumber,
                    currencySplitter : helpers.currencySplitter
                }));
            }
        });

        return PaymentListItemView;
    });
