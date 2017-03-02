define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Filter/dateFilter',
    'text!templates/cashFlow/TopBarTemplate.html',
    'custom',
    'constants',
    'common',
    'moment'
], function (Backbone, $, _, DateFilterView, ContentTopBarTemplate, Custom, CONSTANTS, common, moment) {
    'use strict';

    var TopBarView = Backbone.View.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.CASHFLOW,
        contentHeader: 'Cash Flow',
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render();
        },
        
        render: function () {
            var self = this;
            var dateRange;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('cashFlow.filter');

            var startDate;
            var endDate;

            if (!this.collection) {
                dateRange = filter && filter.date ? filter.date.value : [];

                startDate = new Date(dateRange[0]);
                endDate = new Date(dateRange[1]);
            } else {
                startDate = this.collection.startDate;
                endDate = this.collection.endDate;
            }

            startDate = moment(startDate).format('D MMM, YYYY');
            endDate = moment(endDate).format('D MMM, YYYY');

            $('title').text(this.contentHeader || this.contentType);

            this.$el.html(this.template({
                viewType   : viewType,
                contentType: this.contentType,
                startDate  : this.startDate,
                endDate    : this.endDate
            }));
            
            this.dateFilterView = new DateFilterView({
                contentType: 'cashFlow',
                el         : this.$el.find('#dateFilter')
            });

            this.dateFilterView.on('dateChecked', function () {
                self.trigger('changeDateRange', self.dateFilterView.dateArray);
            });

            this.dateFilterView.checkElement('custom', [startDate, endDate]);

            return this;
        }
    });

    return TopBarView;
});
