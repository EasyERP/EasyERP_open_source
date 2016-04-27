/**
 * Created by Roman on 17.06.2015.
 */
define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Revenue/index.html',
    'text!templates/Revenue/profit.html',
    'text!templates/Revenue/bonus.html',
    'collections/revenue/profit',
    'collections/revenue/bonus',
    'moment',
    'dataService',
    'constants',
    'custom',
    'helpers'
], function (Backbone,
             _,
             $,
             mainTemplate,
             profitTemplate,
             bonusTemplate,
             ProfitCollection,
             BonusCollection,
             moment,
             dataService,
             CONSTANTS,
             custom,
             helpers) {
    'use strict';
    var View = Backbone.View.extend({
        el            : '#content-holder',
        contentType   : CONSTANTS.REVENUE,
        template      : _.template(mainTemplate),
        profitTemplate: _.template(profitTemplate),
        bonusTemplate : _.template(bonusTemplate),

        initialize: function () {
            var dateRange = custom.retriveFromCash('revenueDashDateRange') || {};
            var startDate = dateRange.startDate || moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'week').day('Monday').format('DD MMM, YYYY');
            var endDate = dateRange.endDate || moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'week').day('Sunday').format('DD MMM, YYYY');

            dateRange = dateRange || (this.collection ? this.collection.dateRange : {});
            dateRange = dateRange || {};

            custom.cacheToApp('revenueDashDateRange', {
                startDate: startDate,
                endDate  : endDate
            });

            this.bonusBySalesCollection = new BonusCollection({
                byWeek   : this.byWeek,
                startDate: dateRange.startDate,
                endDate  : dateRange.endDate
            });
            this.bonusBySalesCollection.on('reset', this.renderAllBonusBySales, this);

            this.render();
        },

        changeDateRange: function () {
            this.startDate = this.$startDate.val();
            this.endDate = this.$endDate.val();
            this.collection = new ProfitCollection({
                byWeek   : this.byWeek,
                startDate: this.startDate,
                endDate  : this.endDate
            });
            this.bonusBySalesCollection = new BonusCollection({
                byWeek   : this.byWeek,
                startDate: this.startDate,
                endDate  : this.endDate
            });
            this.collection.on('reset', this.renderProfit, this);
            this.bonusBySalesCollection.on('reset', this.renderAllBonusBySales, this);
        },

        calculateTotal: function ($baseContainer) {
            var badValsRegExp = /\s|\n|\r|\n\r/g;
            var $thisEl = $baseContainer || this.$el;
            var $trsProfit = $thisEl.find('tr.profit');
            var $trsRevenue = $thisEl.find('tr.revenue');

            $trsProfit.each(function () {
                var $el = $(this);
                var $total = $el.find('[data-content="totalBySales"]');
                var $tds = $el.find('td.content');
                var total = 0;

                $tds.each(function () {
                    var _$el = $(this);
                    var val = _$el.text();

                    val = val.replace(badValsRegExp, '');
                    val = val || 0;
                    val = parseFloat(val);

                    total += val;
                });

                $total.text(helpers.currencySplitter(total.toFixed(0)));
            });

            $trsRevenue.each(function () {
                var $el = $(this);
                var id = $el.attr('data-id');
                var $total = $el.find('[data-content="totalBySales"]');
                var $tds = $el.find('td.content');
                var total = 0;
                var rate = 0;
                var $profitTr = $thisEl.find('tr[data-id="' + id + '"].profit');
                var $rate = $profitTr.find('.rate');
                var totslProfit = $profitTr.find('[data-content="totalBySales"]').text();

                totslProfit = totslProfit.replace(badValsRegExp, '');
                totslProfit = totslProfit || 0;

                $tds.each(function () {
                    var _$el = $(this);
                    var val = _$el.text();

                    val = val.replace(badValsRegExp, '');
                    val = val || 0;
                    val = parseFloat(val);

                    total += val;
                });

                rate = (totslProfit / total) * 100;

                if (!isFinite(rate)) {
                    rate = 0;
                }

                $rate.text(rate.toFixed(0));
                $total.text(helpers.currencySplitter(total.toFixed(0)));
            });
        },

        renderProfit: function () {
            var self = this;
            var $thisEl = this.$el;
            var count = this.collection.length;
            var tdWidth = Math.floor(90 / (count + 2));
            var $profitTableContainer = $thisEl.find('#results');

            $profitTableContainer.html(this.profitTemplate({
                collection      : self.collection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));

            this.calculateTotal($profitTableContainer);
        },

        renderAllBonusBySales: function () {
            var self = this;
            var $thisEl = this.$el;
            var count = this.bonusBySalesCollection.length;
            var tdWidth = Math.floor(90 / (count + 1));
            var $revenueTableContainer = $thisEl.find('#allBonusBySales');

            $revenueTableContainer.html(this.bonusTemplate({
                collection      : self.bonusBySalesCollection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));

            this.calculateTotal($revenueTableContainer);
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $currentEl.html(self.template());

            this.byWeek = false;

            this.renderProfit();

            this.$startDate = $('#startDate');
            this.$endDate = $('#endDate');

            return this;
        }
    });

    return View;
});
