define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/stockInventory/list/ListTotal.html',
    'helpers'
], function (Backbone, _, $, listTemplate, helpers) {
    'use strict';
    var OrderListTotalView = Backbone.View.extend({
        el: '#listTotal',

        getTotal: function () {
            var key;
            var result = {};

            for (key in this.findElements) {
                result[key] = result[key] || 0;
                this.element.find('td.' + key).each(function () {
                    result[key] += parseFloat(helpers.spaceReplacer($(this).find('span').text()));
                });
            }
            result.cellSpan = this.cellSpan;

            return result;
        },

        initialize: function (options) {
            this.element = options.element;
            this.cellSpan = options.cellSpan;
            this.invoiceTemplate = options.invoiceTemplate;
            this.findElements = {
                lowStock : 0,
                inStock  : 0,
                allocated: 0,
                onHand   : 0,
                cost     : 0,
                value    : 0
            };
        },

        render   : function () {
            var template = _.template(listTemplate);

            if (this.element.find('tr').length > 0) {
                this.$el.html(template({total: this.getTotal()}));

                this.renderSum();
            }

        },
        renderSum: function () {
            var findElement;
            var key;
            for (key in this.findElements) {
                findElement = this.$el.find('#' + key);
                if (findElement.hasClass('money')) {
                    findElement.text(this.getTotal()[key].toFixed(2));
                } else {
                    findElement.text(this.getTotal()[key]);
                }

            }
        }
    });

    return OrderListTotalView;
});
