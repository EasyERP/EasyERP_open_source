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
    'helpers',
    'spinJs'
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
             helpers,
             Spinner) {
    'use strict';
    var View = Backbone.View.extend({
        el            : '#content-holder',
        contentType   : CONSTANTS.REVENUE,
        template      : _.template(mainTemplate),
        profitTemplate: _.template(profitTemplate),
        bonusTemplate : _.template(bonusTemplate),

        events: {
            'click .chart-tabs': 'changeTab'
        },

        initialize: function (options) {
            var filter = options.filter || custom.retriveFromCash('Revenue.filter') || {};
            var startDate = filter.startDate || moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'week').day('Monday').format('DD MMM, YYYY');
            var endDate = filter.endDate || moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'week').day('Sunday').format('DD MMM, YYYY');

            filter.startDate = startDate;
            filter.endDate = endDate;

            this.filter = filter;

            custom.cacheToApp('Revenue.filter', this.filter);

            this.stopSalesSpinner = _.after(2, this.hideSpinnerTab);
            this.stopPMSpinner = _.after(2, this.hideSpinnerPMTab);

            this.collection = new ProfitCollection({
                byWeek   : this.byWeek,
                startDate: filter.startDate,
                endDate  : filter.endDate
            });
            this.collection.on('reset', this.renderProfit, this);

            this.bonusBySalesCollection = new BonusCollection({
                byWeek   : this.byWeek,
                startDate: filter.startDate,
                endDate  : filter.endDate
            });
            this.bonusBySalesCollection.on('reset', this.renderAllBonusBySales, this);

            this.profitByPmCollection = new ProfitCollection({
                byContent: 'projectsManager',
                byWeek   : this.byWeek,
                startDate: filter.startDate,
                endDate  : filter.endDate
            });
            this.profitByPmCollection.on('reset', this.renderProfitByPM, this);

            this.bonusByPMCollection = new BonusCollection({
                byContent: 'projectsManager',
                byWeek   : this.byWeek,
                startDate: filter.startDate,
                endDate  : filter.endDate
            });
            this.bonusByPMCollection.on('reset', this.renderAllBonusByPM, this);

            this.render();
        },

        showSpinerInTab: function (el) {
            var opts = {
                lines    : 17, // The number of lines to draw
                length   : 30, // The length of each line
                width    : 5, // The line thickness
                radius   : 30, // The radius of the inner circle
                scale    : 0.75, // Scales overall size of the spinner
                corners  : 1, // Corner roundness (0..1)
                color    : '#fff', // #rgb or #rrggbb or array of colors
                opacity  : 0.25, // Opacity of the lines
                rotate   : 68, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                speed    : 1.6, // Rounds per second
                trail    : 89, // Afterglow percentage
                fps      : 20, // Frames per second when using setTimeout() as a fallback for CSS
                zIndex   : 2000000000, // The z-index (defaults to 2000000000)
                className: 'spinner', // The CSS class to assign to the spinner
                top      : '50%', // Top position relative to parent
                left     : '50%', // Left position relative to parent
                shadow   : true, // Whether to render a shadow
                hwaccel  : false, // Whether to use hardware acceleration
                position : 'fixed' // Element positioning
            };
            var spinner = new Spinner(opts).spin(el);
        },

        hideSpinnerTab: function () {
            this.$profitBySales.fadeOut();
        },

        hideSpinnerPMTab: function () {
            this.$profitByPM.fadeOut();
        },

        changeTab: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $aEllement = $target.closest('a');
            var $dialogHolder;
            var n;

            $target.closest('.chart-tabs').find('a.active').removeClass('active');
            $aEllement.addClass('active');
            n = $target.parents('.chart-tabs').find('li').index($aEllement.parent());
            $dialogHolder = $thisEl.find('.dialog-tabs-items');
            $dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            $dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        changeDateRange: function () {
            var filter = this.filter || custom.retriveFromCash('Revenue.filter') || {};

            this.startDate = this.$startDate.val();
            this.endDate = this.$endDate.val();

            filter.startDate = moment(this.startDate).toDate();
            filter.endDate = moment(this.endDate).toDate();

            this.filter = filter;

            custom.cacheToApp('Revenue.filter', this.filter);

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
            this.profitByPmCollection = new ProfitCollection({
                byContent: 'projectsManager',
                byWeek   : this.byWeek,
                startDate: this.startDate,
                endDate  : this.endDate
            });
            this.bonusByPMCollection = new BonusCollection({
                byContent: 'projectsManager',
                byWeek   : this.byWeek,
                startDate: this.startDate,
                endDate  : this.endDate
            });
            this.collection.on('reset', this.renderProfit, this);
            this.bonusBySalesCollection.on('reset', this.renderAllBonusBySales, this);
            this.profitByPmCollection.on('reset', this.renderProfitByPM, this);
            this.bonusByPMCollection.on('reset', this.renderAllBonusByPM, this);

            this.changeLocation(this.filter);
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
                var $profitTr = $thisEl.find('tr[data-id="' + id + '"].profit');
                var $rate = $profitTr.find('.rate');
                var totslProfit = $profitTr.find('[data-content="totalBySales"]').text();
                var rate;

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
            this.stopSalesSpinner();
        },

        renderAllBonusBySales: function () {
            var self = this;
            var $thisEl = this.$el;
            var count = this.bonusBySalesCollection.length;
            var tdWidth = Math.floor(90 / (count + 1));
            var $bonusTableContainer = $thisEl.find('#allBonusBySales');

            $bonusTableContainer.html(this.bonusTemplate({
                collection      : self.bonusBySalesCollection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));

            this.calculateTotal($bonusTableContainer);
            this.stopSalesSpinner();
        },

        renderAllBonusByPM: function () {
            var self = this;
            var $thisEl = this.$el;
            var count = this.bonusByPMCollection.length;
            var tdWidth = Math.floor(90 / (count + 1));
            var $bonusTableContainer = $thisEl.find('#allBonusByPM');

            $bonusTableContainer.html(this.bonusTemplate({
                collection      : self.bonusByPMCollection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));

            this.calculateTotal($bonusTableContainer);
            this.stopPMSpinner();
        },

        renderProfitByPM: function () {
            var self = this;
            var $thisEl = this.$el;
            var count = this.profitByPmCollection.length;
            var tdWidth = Math.floor(90 / (count + 2));
            var $profitTableContainer = $thisEl.find('#profitByPm');

            $profitTableContainer.html(this.profitTemplate({
                collection      : self.profitByPmCollection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));

            this.calculateTotal($profitTableContainer);
            this.stopPMSpinner();
        },

        changeLocation: function (filter) {
            var url = '#easyErp/Revenue';

            if (filter) {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));

                Backbone.history.navigate(url);
            }
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $currentEl.html(self.template());

            this.$profitBySales = $currentEl.find('#allBonusBySales').closest('div.dialog-tabs-item').find('div.spinLoader');
            this.showSpinerInTab(this.$profitBySales.get(0));
            this.$profitByPM = $currentEl.find('#profitByPm').closest('div.dialog-tabs-item').find('div.spinLoader');
            this.showSpinerInTab(this.$profitByPM.get(0));

            this.byWeek = false;

            // this.renderProfit();
            this.$startDate = $('#startDate');
            this.$endDate = $('#endDate');

            this.changeLocation(this.filter);

            return this;
        }
    });

    return View;
});
