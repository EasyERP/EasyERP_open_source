/**
 * Created by soundstorm on 14.05.15.
 */
define([
        'text!templates/customerPayments/list/ListTotal.html',
        'helpers'
    ],

    function (listTemplate, helpers) {
        var supplierPaymentsListTotalView = Backbone.View.extend({
            el: '#listTotal',

            initialize: function (options) {
                this.element = options.element;
                this.cellSpan = options.cellSpan;
            },

            getTotal: function () {
                var result = {
                    total           : 0,
                    totalPaidAmount : 0,
                    cellSpan        : this.cellSpan,
                    currencySplitter: helpers.currencySplitter
                };

                //this.element.find(".total").each(function () {
                //    var currentText = $(this).text().replace(' ', '');
                //
                //    result.total += parseFloat(currentText);
                //});

                this.element.find(".totalPaidAmount").each(function () {
                    var currentText = $(this).text().replace(' ', '');

                    result.totalPaidAmount += parseFloat(currentText);
                });

                result.total = result.total.toFixed(2);
                result.totalPaidAmount = result.totalPaidAmount.toFixed(2);

                return result;
            },

            render: function () {
                var totalObject;

                if (this.$el.find("tr").length > 0) {
                    totalObject = this.getTotal();

                    this.$el.find("#total").text(helpers.currencySplitter(totalObject.total));
                    this.$el.find("#totalPaidAmount").text(helpers.currencySplitter(totalObject.totalPaidAmount));
                } else {
                    this.$el.append(_.template(listTemplate, this.getTotal()));
                }

                return this;
            }
        });

        return supplierPaymentsListTotalView;
    });