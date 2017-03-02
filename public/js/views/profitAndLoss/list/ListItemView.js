define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/profitAndLoss/list/ListTemplate.html',
    'helpers'
], function (Backbone, $, _, listTemplate, helpers) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTableIncome',

        initialize: function (options) {
            this.collection = options.collection && options.collection[0] ? options.collection[0] : {};

            this.income = this.collection.income || [];
            this.expenses = this.collection.expenses || [];
            this.dividends = this.collection.dividends || [];
            this.cogs = this.collection.cogs || [];
            this.taxes = this.collection.taxes || [];

            this.startDate = options.startDate;
            this.endDate = options.endDate;
        },

        setAllTotalVals: function () {
            var self = this;
            var tds = $('td.countable');

            tds.each(function () {
                self.calcTotal($(this).attr('data-id'));
            });
        },

        calcTotal: function (idTotal) {
            var trsIncome = this.$el.find('tr');
            var trsCogs = $('#listTableCogs').find('tr');
            var trsExpenses = $('#listTableExpenses').find('tr');
            var dividendsTrs = $('#listTableDividends').find('tr');
            var taxesTrs = $('#listTableTaxes').find('tr');
            var rowTdValGoss = 0;
            var rowTdValExp = 0;
            var rowTdValCogs = 0;
            var rowTdValDividends = 0;
            var rowTdValTaxes = 0;
            var row;
            var rowTd;
            var expFooter = $('#expFooter');
            var grossFooter = $('#grossFooter');
            var cogsFooter = $('#cogsFooter');
            var netOrdinaryIncome = $('#netOrdinaryIncome');
            var dividendsFooter = $('#dividendsFooter');
            var taxesFooter = $('#taxesFooter');
            var totalTd = $('#incomeFooter');
            var netIncome = $('#netIncome');
            var grossProfit = $('#grossProfit');
            var totalOther = $('#totalOther');
            var income = $('#income');

            $(trsIncome).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                rowTdValGoss += parseFloat(rowTd.attr('data-value')) || 0;
            });

            $(trsCogs).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                rowTdValCogs += parseFloat(rowTd.attr('data-value')) || 0;
            });

            $(trsExpenses).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                rowTdValExp += parseFloat(rowTd.attr('data-value')) || 0;
            });

            $(dividendsTrs).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                rowTdValDividends += parseFloat(rowTd.attr('data-value')) || 0;
            });

            $(taxesTrs).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                rowTdValTaxes += parseFloat(rowTd.attr('data-value')) || 0;
            });

            expFooter.text('');
            grossFooter.text('');
            cogsFooter.text('');
            netOrdinaryIncome.text('');
            dividendsFooter.text('');
            taxesFooter.text('');
            totalTd.text('');
            netIncome.text('');
            grossProfit.text('');
            totalOther.text('');
            income.text('');

            totalTd.text(helpers.currencySplitter((rowTdValGoss / 100).toFixed(2)));
            cogsFooter.text(helpers.currencySplitter((rowTdValCogs / 100).toFixed(2)));
            grossProfit.text(helpers.currencySplitter(((rowTdValGoss - rowTdValCogs) / 100).toFixed(2)));
            expFooter.text(helpers.currencySplitter((rowTdValExp / 100).toFixed(2)));
            netOrdinaryIncome.text(helpers.currencySplitter(((rowTdValGoss - rowTdValCogs - rowTdValExp) / 100).toFixed(2)));

            dividendsFooter.text(helpers.currencySplitter((rowTdValDividends / 100).toFixed(2)));
            taxesFooter.text(helpers.currencySplitter((rowTdValTaxes / 100).toFixed(2)));
            totalOther.text(helpers.currencySplitter(((rowTdValDividends + rowTdValTaxes) / 100).toFixed(2)));
            netIncome.text(helpers.currencySplitter(((rowTdValGoss - rowTdValCogs - rowTdValExp - rowTdValTaxes) / 100).toFixed(2)));
          income.text(helpers.currencySplitter(((rowTdValGoss - rowTdValCogs - rowTdValExp - rowTdValTaxes - rowTdValDividends) / 100).toFixed(2)));

        },

        render: function () {

            this.$el.html(_.template(listTemplate, {
                collection      : this.income,
                currencySplitter: helpers.currencySplitter
            }));

            $('#listTableCogs').append(_.template(listTemplate, {
                collection      : this.cogs,
                currencySplitter: helpers.currencySplitter
            }));

            $('#listTableExpenses').append(_.template(listTemplate, {
                collection      : this.expenses,
                currencySplitter: helpers.currencySplitter
            }));

            $('#listTableTaxes').append(_.template(listTemplate, {
                collection      : this.taxes,
                currencySplitter: helpers.currencySplitter
            }));

            $('#listTableDividends').append(_.template(listTemplate, {
                collection      : this.dividends,
                currencySplitter: helpers.currencySplitter
            }));

            this.setAllTotalVals();

            return this;
        }
    });

    return ListItemView;
});
