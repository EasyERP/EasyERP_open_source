/**
 * Created by liliy on 18.03.2016.
 */
"use strict";
define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/profitAndLoss/list/ListTemplate.html',
        'helpers'
    ],

    function (Backbone, $, _, listTemplate, helpers) {
        var ListItemView = Backbone.View.extend({
            el: '#listTableGrossFit',

            initialize: function (options) {
                this.collection = options.collection && options.collection[0] ? options.collection[0] : {};

                this.grossFit = this.collection.grossFit || [];
                this.expenses = this.collection.expenses || [];

                this.startDate = options.startDate;
                this.endDate = options.endDate;
            },

            setAllTotalVals: function () {
                var self = this;
                var ths = $('#caption').find('th');

                ths.each(function () {
                    if ($(this).hasClass('countable')) {
                        self.calcTotal($(this).attr('data-id'));
                    }
                });
            },

            calcTotal: function (idTotal) {
                var trsGrossFit = this.$el.find('tr');
                var trsExpenses = $('#listTableExpenses').find('tr');
                var totalTd = $('#totalSumm');
                var rowTdValGoss = 0;
                var rowTdValExp = 0;
                var rowTdVal = 0;
                var row;
                var rowTd;

                var expFooter = $('#expFooter');
                var grossFooter = $('#grossFooter');

                $(trsGrossFit).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    rowTdValGoss += parseFloat(rowTd.attr('data-value')) || 0;
                });

                $(trsExpenses).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    rowTdValExp += parseFloat(rowTd.attr('data-value')) || 0;
                });

                totalTd.text('');
                grossFooter.text('');
                expFooter.text('');

                totalTd.text(helpers.currencySplitter((rowTdValGoss - rowTdValExp).toFixed(2)));
                grossFooter.text(helpers.currencySplitter(rowTdValGoss.toFixed(2)));
                expFooter.text(helpers.currencySplitter(rowTdValExp.toFixed(2)));
                totalTd.attr('data-value', rowTdVal);

            },

            render: function () {
                this.$el.append(_.template(listTemplate, {
                    collection      : this.grossFit,
                    expenses        : this.expenses,
                    currencySplitter: helpers.currencySplitter
                }));

                $('#listTableExpenses').append(_.template(listTemplate, {
                    collection      : this.expenses,
                    currencySplitter: helpers.currencySplitter
                }));

                this.setAllTotalVals();

                return this;
            }
        });

        return ListItemView;
    });
