/**
 * Created by soundstorm on 14.05.15.
 */
define([
        'text!templates/supplierPayments/list/ListTotal.html'
    ],

    function (listTemplate) {
        var supplierPaymentsListTotalView = Backbone.View.extend({
            el: '#listTotal',

            getTotal: function () {
                var result = {total: 0, cellSpan: this.cellSpan};
                this.element.find(".total").each(function() {
                    result.total += parseFloat($(this).text());
                });
                return result;
            },

            initialize: function(options) {
                this.element = options.element;
                this.cellSpan = options.cellSpan;
            },
            render: function() {
                if (this.$el.find("tr").length>0){
                    this.$el.find("#total").text(this.getTotal().total.toFixed(2));
                } else {
                    this.$el.append(_.template(listTemplate, this.getTotal()));
                }
            }
        });

        return supplierPaymentsListTotalView;
    });