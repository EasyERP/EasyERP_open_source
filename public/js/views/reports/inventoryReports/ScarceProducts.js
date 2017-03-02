define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/reports/salesReports/InfoBySalesTemplate.html',
    'text!templates/reports/inventoryReports/LowStockTemplate.html',
    'text!templates/reports/inventoryReports/lowStock/listTemplate.html',
    'views/listViewBase',
    'views/Filter/dateFilter',
    'dataService',
    'moment',
    'helpers',
    'mixins/listView'
], function (Backbone, _, $, main, LowStockTemplate, listTemplate, ListViewBase, DateFilterView, dataService, moment, helpers, listMixIn) {
    'use strict';

    var ContentView = ListViewBase.extend({
        template       : _.template(main),
        tableTemplate  : _.template(LowStockTemplate),
        listTemplate   : _.template(listTemplate),
        childView      : null,
        hasPagination  : false,
        noNeedCreatedIn: true,

        el: '#scarceProducts',

        initialize: function (options) {
            this.collection = options.collection;
            this.datesArray = options.datesArray;

            ListViewBase.prototype.initialize.call(this, options);

            this.collection.bind('showmore', this.showMoreContent, this);
            this.render();
        },

        showMoreContent: function (newModels) {
            var $holder = this.$el;

            $holder.find('#listTable').empty();

            $holder.find('#listTable').append(this.listTemplate({
                collection      : this.collection.toJSON(),
                currencySplitter: helpers.currencySplitter
            }));
        },

        changeDateRange: function (dateArray) {
            var self = this;
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            dataService.getData('/reports/scarceProducts', {
                startDate: this.startDate,
                endDate  : this.endDate
            }, function (resp) {
                self.collection.set(resp.data);

                self.renderChart();
            });
        },

        renderChart: function () {
            this.$el.find('.tableListWrap').html(this.tableTemplate({
                collection      : this.collection.toJSON(),
                currencySplitter: helpers.currencySplitter
            }));

            this.showMoreContent();
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.html(this.template({
                className: 'hidden'
            }));

            $thisEl.find('.scaleButtons').hide();

            this.renderChart();
        }
    });

    ContentView = listMixIn(ContentView);

    return ContentView;
});


