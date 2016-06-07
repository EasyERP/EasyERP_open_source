define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/DividendPayments/list/ListTotal.html',
    'helpers'
], function (Backbone, $, _, listTemplate, helpers) {
    var supplierPaymentsListTotalView = Backbone.View.extend({
        el: '#listTotal',

        getTotal: function () {
            var result = {
                total           : 0,
                totalPaid       : 0,
                totalAmount     : 0,
                cellSpan        : this.cellSpan,
                currencySplitter: helpers.currencySplitter
            };

            var text;

            this.element.find('.totalPaid').each(function () {
                text = $(this).text();
                text = text.replace(' ', '');

                result.totalPaid += parseFloat(text);
            });

            result.totalPaid = result.totalPaid.toFixed(2);
            result.totalAmount = result.totalAmount.toFixed(2);

            return result;
        },

        initialize: function (options) {
            this.element = options.element;
            this.cellSpan = options.cellSpan;
            this.wTrack = options.wTrack;
        },

        render: function () {
            var result = this.getTotal();

            if (this.$el.find('tr').length > 0) {
                if (this.wTrack) {
                    this.$el.find('#totalPaid').text(result.totalPaid);
                    this.$el.find('#totalAmount').text(result.totalAmount);
                } else {
                    this.$el.find('#total').text(this.getTotal('.total').total);
                }
            } else {
                this.$el.append(_.template(listTemplate, this.getTotal()));
            }
        }
    });

    return supplierPaymentsListTotalView;
});
