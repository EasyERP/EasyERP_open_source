/**
 * Created by soundstorm on 14.05.15.
 */
define([
        'text!templates/Invoice/list/ListTotal.html'
    ],

    function (listTemplate) {
        var OrderListTotalView = Backbone.View.extend({
            el: '#listTotal',

            getTotal: function () {
                var result = {untaxed: 0, total: 0};
                this.element.find(".untaxed").each(function() {
                    result.untaxed += parseFloat($(this).text());
                });
                this.element.find(".total").each(function() {
                    result.total += parseFloat($(this).text());
                });

                return result
            },

            initialize: function(options) {
                this.element = options.element;
            },
            render: function() {

                this.$el.append(_.template(listTemplate, this.getTotal()));
            }
        });

        return OrderListTotalView;
    });