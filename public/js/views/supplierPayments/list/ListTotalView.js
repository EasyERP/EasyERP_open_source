/**
 * Created by soundstorm on 14.05.15.
 */
define([
        'text!templates/supplierPayments/list/ListTotal.html',
        'text!templates/supplierPayments/forWTrack/ListTotal.html',
        'helpers'
    ],

    function (listTemplate, forWTrackListTemplate, helpers) {
        var supplierPaymentsListTotalView = Backbone.View.extend({
            el: '#listTotal',

            getTotal: function () {
                var result = {
                    total: 0,
                    totalPaid: 0,
                    totalAmount: 0,
                    cellSpan: this.cellSpan,
                    currencySplitter: helpers.currencySplitter
                };

                var text;

                if (this.wTrack) {
                    this.element.find('.totalPaid').each(function () {
                        text = $(this).text();
                        text = text.replace(' ', '');

                        result.totalPaid += parseFloat(text);
                    })

                    this.element.find('.totalAmount').each(function () {
                        text = $(this).text();
                        text = text.replace(' ', '');

                        result.totalAmount += parseFloat(text);
                    })
                } else {
                    this.element.find('.total').each(function () {
                        text = $(this).text();
                        text = text.replace(' ', '');

                        result.total += parseFloat(text);
                    })
                }

                result.totalPaid = result.totalPaid.toFixed(2);
                result.totalAmount = result.totalAmount.toFixed(2);

                return result
            },

            initialize: function (options) {
                this.element = options.element;
                this.cellSpan = options.cellSpan;
                this.wTrack = options.wTrack;
            },
            render: function () {
                var result = this.getTotal();

                if (this.$el.find("tr").length > 0) {
                    if (this.wTrack) {
                        this.$el.find("#totalPaid").text(result.totalPaid);
                        this.$el.find("#totalAmount").text(result.totalAmount);
                    } else {
                        this.$el.find("#total").text(this.getTotal('.total').total);
                    }
                } else {
                    if (this.wTrack) {
                        this.$el.append(_.template(forWTrackListTemplate, this.getTotal()));
                    } else {
                        this.$el.append(_.template(listTemplate, this.getTotal()));
                    }
                }
            }
        });

        return supplierPaymentsListTotalView;
    });