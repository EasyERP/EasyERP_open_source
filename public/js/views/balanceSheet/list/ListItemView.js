/**
 * Created by liliy on 18.03.2016.
 */
"use strict";
define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/balanceSheet/list/ListTemplate.html',
        'helpers'
    ],

    function (Backbone, $, _, listTemplate, helpers) {
        var ListItemView = Backbone.View.extend({
            el: '.containerContent',

            initialize: function (options) {
                this.collection = options.collection && options.collection[0] ? options.collection[0] : {};

                this.assets = this.collection.assets || [];
                this.liabilities = this.collection.liabilities || [];
                this.equity = this.collection.equity || [];

                this.startDate = options.startDate;
                this.endDate = options.endDate;
            },

            setAllTotalVals: function () {
                var self = this;
                var ths = this.$el.find('th');

                ths.each(function () {
                    if ($(this).hasClass('countable')) {
                        self.calcTotal($(this).attr('data-id'));
                    }
                });
            },

            calcTotal: function (idTotal) {
                var trsAssets = this.$el.find('#listTableAssets').find('tr');
                var trsLiabilities = this.$el.find('#listTableLiabilities').find('tr');
                var trsEquity = this.$el.find('#listTableEquity').find('tr');
                var assets = 0;
                var liabilities = 0;
                var equity = 0;
                var row;
                var rowTd;
                var totalEquityAndLiabilities;

                var assetsFooter = this.$el.find('#assetsFooter');
                var liabilitiesFooter = this.$el.find('#liabilitiesFooter');
                var equityFooter = this.$el.find('#equityFooter');
                var equtotalEquityityFooter = this.$el.find('#totalSumm');

                $(trsAssets).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    assets += parseFloat(rowTd.attr('data-value')) || 0;
                });

                $(trsLiabilities).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    liabilities += parseFloat(rowTd.attr('data-value')) || 0;
                });

                $(trsEquity).each(function (index, element) {
                    row = $(element).closest('tr');
                    rowTd = row.find('[data-id="' + idTotal + '"]');

                    equity += parseFloat(rowTd.attr('data-value')) || 0;
                });

                assetsFooter.text('');
                liabilitiesFooter.text('');
                equityFooter.text('');
                equtotalEquityityFooter.text('');

                assetsFooter.text(helpers.currencySplitter((assets / 100).toFixed(2)));
                liabilitiesFooter.text(helpers.currencySplitter((liabilities / 100).toFixed(2)));
                equityFooter.text(helpers.currencySplitter((equity / 100).toFixed(2)));
                equtotalEquityityFooter.text(helpers.currencySplitter(((equity + liabilities) / 100).toFixed(2)));
            },

            render: function () {
                this.$el.find('#listTableAssets').append(_.template(listTemplate, {
                    collection      : this.assets,
                    currencySplitter: helpers.currencySplitter
                }));

                this.$el.find('#listTableLiabilities').append(_.template(listTemplate, {
                    collection      : this.liabilities,
                    currencySplitter: helpers.currencySplitter
                }));

                this.$el.find('#listTableEquity').append(_.template(listTemplate, {
                    collection      : this.equity,
                    currencySplitter: helpers.currencySplitter
                }));

                this.setAllTotalVals();

                return this;
            }
        });

        return ListItemView;
    });
