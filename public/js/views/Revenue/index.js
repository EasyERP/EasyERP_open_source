/**
 * Created by Roman on 17.06.2015.
 */
define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Revenue/index.html',
    'text!templates/Revenue/profit.html',
    'collections/revenue/profit',
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
             ProfitCollection,
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

        initialize: function () {
            var dateRange = custom.retriveFromCash('revenueDashDateRange') || {};
            var startDate = dateRange.startDate || moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'week').day('Monday').format('DD MMM, YYYY');
            var endDate = dateRange.endDate || moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'week').day('Sunday').format('DD MMM, YYYY');

            custom.cacheToApp('revenueDashDateRange', {
                startDate: startDate,
                endDate  : endDate
            });

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
            this.collection.on('reset', this.renderContent, this);
        },

        renderContent: function () {
            var self = this;
            var count = this.collection.length;
            var tdWidth = Math.floor(90 / count);
            var $tableContainer = this.$el.find('#results');

            $tableContainer.html(this.profitTemplate({
                collection      : self.collection,
                currencySplitter: helpers.currencySplitter,
                tdWidth         : tdWidth,
                count           : count
            }));
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;

            $currentEl.html(self.template());

            this.byWeek = false;

            this.renderContent();

            this.$startDate = $('#startDate');
            this.$endDate = $('#endDate');

            return this;
        }
    });

    return View;
});
