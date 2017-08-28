define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/balanceSheet/list/ListTemplate.html',
    'helpers'
], function (Backbone, $, _, listTemplate, helpers) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#container',

        initialize: function (options) {
            this.collection = options.collection[0];

            this.assets = this.collection.assets || [];
            this.fixedAssets = this.collection.fixedAssets || [];
            this.currentAssets = this.collection.currentAssets || [];
            this.liabilities = this.collection.liabilities || [];
            this.equity = this.collection.equity || [];

            this.startDate = options.startDate;
            this.endDate = options.endDate;
        },

        setAllTotalVals: function () {
            var self = this;
            var trs = this.$el.find('tr.countable');
            var cash;
            var accountReceivable;
            var inventory;
            var currentRatio = this.$el.find('#currentRatio');
            var quickRatio = this.$el.find('#quickRatio');
            var cashRatio = this.$el.find('#cashRatio');
            var workingCapital = this.$el.find('#workingCapital');
            var ratio;
            var cashR;
            var workingCap;
            var quickR;
            var assets;

            var currentAssets = this.currentAssets && this.currentAssets.length ? this.currentAssets[0] : {};
            var fixedAssets = this.fixedAssets && this.fixedAssets.length ? this.fixedAssets[0] : {};
            var assetsRoot = currentAssets.root.concat(fixedAssets.root) || [];
            var liabilities = this.liabilities && this.liabilities.length ? this.liabilities[0] : {};

            cash = _.find(assetsRoot, function (el) {
                if (el._id === '5810c75b2b225158086d7f81') {
                    return el;
                }
            });

            cash = cash ? Math.abs(cash.debit - cash.credit) : 0;

            inventory = _.find(assetsRoot, function (el) {
                if (el._id === '5810c75b2b225158086d7f87') {
                    return el;
                }
            });

            inventory = inventory ? isNaN(Math.abs(inventory.debit - inventory.credit)) ? 0 : Math.abs(inventory.debit - inventory.credit) : 0;

            assets = currentAssets || fixedAssets ? isNaN(Math.abs((currentAssets.debit + fixedAssets.debit) - (currentAssets.credit + fixedAssets.credit))) ? 0 : Math.abs((currentAssets.debit + fixedAssets.debit) - (currentAssets.credit + fixedAssets.credit)) : 0;
            liabilities = liabilities ? isNaN(Math.abs(liabilities.debit - liabilities.credit)) ? 0 : Math.abs(liabilities.debit - liabilities.credit) : 0;

            ratio = isFinite(assets / liabilities) ? assets / liabilities : 0;
            cashR = isFinite(cash / liabilities) ? cash / liabilities : 0;
            workingCap = isFinite(assets - liabilities) ? (assets - liabilities) : 0;
            quickR = isFinite((assets - inventory) / liabilities) ? (assets - inventory) / liabilities : 0;

            currentRatio.text(ratio.toFixed(1) + ' %');
            quickRatio.text(quickR.toFixed(1) + ' %');
            cashRatio.text(cashR.toFixed(1) + ' %');
            workingCapital.text(helpers.currencySplitter((workingCap / 100).toFixed(1)));

            this.$el.find('#currentEarningsFooter').find('.money').text(helpers.currencySplitter((this.collection.sum / 100).toFixed(2)))

            trs.each(function () {
                if ($(this).hasClass('countable')) {
                    self.calcTotal($(this).find('.money').attr('data-id'));
                }
            });

        },

        calcTotal: function (idTotal) {
            var trsCurrentAssets = this.$el.find('#listTableCurrentAssets').find('tr');
            var trsFixedAssets = this.$el.find('#listTableFixedAssets').find('tr');
            var trsLiabilities = this.$el.find('#listTableLiabilities').find('tr');
            var trsEquity = this.$el.find('#listTableEquity').find('tr');
            var currentAssets = 0;
            var fixedAssets = 0;
            var liabilities = 0;
            var equity = 0;
            var row;
            var rowTd;
            var span;
            var val;

            var currentAssetsFooter = this.$el.find('#currentAssetsFooter');
            var fixedAssetsFooter = this.$el.find('#fixedAssetsFooter');
            var liabilitiesFooter = this.$el.find('#liabilitiesFooter');
            var totalAssetsSummFooter = this.$el.find('#totalAssetsSumm');
            var equityFooter = this.$el.find('#equityFooter');
            var totalEquityityFooter = this.$el.find('#totalSumm');
            var mainRowObjValue = {};

            $(trsCurrentAssets).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                currentAssets += parseFloat(rowTd.attr('data-value')) || 0;

                mainRowObjValue[row.attr('data-id')] = true;
            });

            $(trsFixedAssets).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                fixedAssets += parseFloat(rowTd.attr('data-value')) || 0;

                mainRowObjValue[row.attr('data-id')] = true;
            });

            $(trsLiabilities).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                liabilities += parseFloat(rowTd.attr('data-value')) || 0;

                mainRowObjValue[row.attr('data-id')] = true;

            });

            $(trsEquity).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-id="' + idTotal + '"]');

                equity += parseFloat(rowTd.attr('data-value')) || 0;

                mainRowObjValue[row.attr('data-id')] = true;
            });

            /* Object.keys(mainRowObjValue).forEach(function (key) {

             $('[data-main="' + key + '"]').find('td.calcPercent').each(function () {
             var sum = helpers.spaceReplacer($(this).find('.money').text());

             sum = parseFloat(sum);

             val = !isNaN((sum / (assets / 100)) * 100) ? (sum / (assets / 100)) * 100 : 0;

             if (val < 0) {
             val *= -1;
             }

             $(this).find('.percent').text(helpers.currencySplitter(val.toFixed(1)) + ' %');
             });

             });*/

            currentAssetsFooter.find('.money').text(helpers.currencySplitter((currentAssets / 100).toFixed(2)));
            fixedAssetsFooter.find('.money').text(helpers.currencySplitter((fixedAssets / 100).toFixed(2)));
            liabilitiesFooter.find('.money').text(helpers.currencySplitter((liabilities / 100).toFixed(2)));
            equityFooter.find('.money').text(helpers.currencySplitter(((equity + this.collection.sum )/ 100).toFixed(2)));
            totalEquityityFooter.find('.money').text(helpers.currencySplitter(((equity + this.collection.sum + liabilities) / 100).toFixed(2)));
            totalAssetsSummFooter.find('.money').text(helpers.currencySplitter(((currentAssets + fixedAssets) / 100).toFixed(2)));

            /*assetsFooter.find('.percent').text(helpers.currencySplitter(assets ? ((assets / assets) * 100).toFixed(2) : '0') + ' %');
             liabilitiesFooter.find('.percent').text(helpers.currencySplitter(assets ? ((liabilities / assets) * 100).toFixed(2) : '0') + ' %');
             equityFooter.find('.percent').text(helpers.currencySplitter(assets ? ((equity / assets) * 100).toFixed(2) : '0') + ' %');
             totalEquityityFooter.find('.percent').text(helpers.currencySplitter(assets ? (((equity + liabilities) / assets) * 100).toFixed(2) : '0') + ' %');*/
        },

        render: function () {
            /* this.$el.find('#listTableAssets').append(_.template(listTemplate, {
             collection      : this.assets,
             currencySplitter: helpers.currencySplitter
             }));*/

            this.$el.find('#listTableCurrentAssets').append(_.template(listTemplate, {
                collection      : this.currentAssets,
                currencySplitter: helpers.currencySplitter
            }));

            this.$el.find('#listTableFixedAssets').append(_.template(listTemplate, {
                collection      : this.fixedAssets,
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
