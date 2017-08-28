define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/reports/salesReports/InfoBySalesTemplate.html',
    'text!templates/reports/inventoryReports/ProductListingTemplate.html',
    'text!templates/reports/inventoryReports/productListing/listTemplate.html',
    'views/listViewBase',
    'views/Filter/dateFilter',
    'dataService',
    'moment',
    'helpers',
    'mixins/listView'
], function (Backbone, _, $, main, ProductListingTemplate, listTemplate, ListViewBase, DateFilterView, dataService, moment, helpers, listMixIn) {
    'use strict';

    var ContentView = ListViewBase.extend({
        template       : _.template(main),
        tableTemplate  : _.template(ProductListingTemplate),
        listTemplate   : _.template(listTemplate),
        childView      : null,
        hasPagination  : false,
        noNeedCreatedIn: true,

        el: '#productListing',

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
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));
        },

        changeDateRange: function (dateArray) {
            var self = this;
            this.startDate = dateArray[0];
            this.endDate = dateArray[1];

            dataService.getData('/reports/getProductListingReport', {
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
            this.$el.html(this.template({
                className: 'hidden'
            }));

            this.renderChart();
            $thisEl.find('.scaleButtons').hide();
        }
    });

    ContentView = listMixIn(ContentView);

    return ContentView;
});

