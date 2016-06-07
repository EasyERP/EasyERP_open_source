define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salesProforma/list/ListTotal.html',
    'helpers'
], function (Backbone, $, _, listTemplate, helper) {
    var OrderListTotalView = Backbone.View.extend({
        el: '#listTotal',

        getTotal: function () {
            var result = {paid: 0, total: 0, balance: 0, cellSpan: this.cellSpan};
            this.element.find('.total').each(function () {
                result.total += parseFloat(helper.spaceReplacer($(this).text()));
            });
            this.element.find('td.paid').each(function () {
                result.paid += parseFloat(helper.spaceReplacer($(this).text()));
            });
            this.element.find('.balance').each(function () {
                result.balance += parseFloat(helper.spaceReplacer($(this).text()));
            });
            return result;
        },

        initialize: function (options) {
            this.element = options.element;
            this.cellSpan = options.cellSpan;
        },

        render: function () {
            var total = this.getTotal();
            if (this.$el.find('tr').length > 0) {
                this.$el.find('#paid').text(helper.currencySplitter(total.paid.toFixed(2)));
                this.$el.find('#total').text(helper.currencySplitter(total.total.toFixed(2)));
                this.$el.find('#balance').text(helper.currencySplitter(total.balance.toFixed(2)));
            } else {
                this.$el.append(_.template(listTemplate, this.getTotal()));
            }
        }
    });

    return OrderListTotalView;
});
