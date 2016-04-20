/**
 * Created by Roman on 17.06.2015.
 */
define([
    'Backbone',
    'Underscore',
    'text!templates/Revenue/index.html',
    'text!templates/Revenue/profit.html',
    'moment',
    'dataService',
    'constants',
    'custom'
], function (Backbone,
             _,
             mainTemplate,
             profitTemplate,
             moment,
             dataService,
             CONSTANTS,
             custom) {
    'use strict';
    var View = Backbone.View.extend({
        el: '#content-holder',

        contentType: CONSTANTS.REVENUE,

        template: _.template(mainTemplate),

        events: {
            'change #currentStartWeek': 'changeWeek',
            'click .ui-spinner-button': 'changeWeek',
            'click .clickToShow'      : 'showBonus'
        },

        initialize: function () {
            var self = this;

            var dateRange = custom.retriveFromCash('revenueDashDateRange') || {};
            var startDate = dateRange.startDate || moment().subtract(CONSTANTS.DASH_VAC_WEEK_BEFORE, 'week').day("Monday").format('DD MMM, YYYY');
            var endDate = dateRange.endDate || moment().add(CONSTANTS.DASH_VAC_WEEK_AFTER, 'week').day("Sunday").format('DD MMM, YYYY');


            custom.cacheToApp('revenueDashDateRange', {
                startDate: startDate,
                endDate  : endDate
            });
        },

        fetchProfit: function () {
            var self = this;
            var data = {
                week: this.model.get('currentStartWeek'),
                year: this.model.get('currentYear')
            };

            dataService.getData('/revenue/profit', data, function (profitData) {
                /*self.model.set('allBonusByMonth', allBonus);
                 self.model.trigger('change:allBonusByMonth');*/

                console.log(profitData);
            });
        },

        render: function (employees) {
            var self = this;
            var thisEl = this.$el;
            var model = this.model.toJSON();

            $('title').text(this.contentType);

            this.employees = employees;

            model.employees = employees;

            this.$el.html(this.template(model));

            this.$el.find('#currentStartWeek').spinner({
                min: 0,
                max: 54
            });

            this.$currentStartWeek = thisEl.find('#currentStartWeek');
            this.$revenueBySales = thisEl.find('.revenueBySales');

            this.rendered = true;

            return this;
        }
    });

    return View;
});
