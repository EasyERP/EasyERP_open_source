define([
    'Backbone',
    'collections/parent',
    'models/invReportModel',
    'custom',
    'moment',
    'constants'
], function (Backbone, Parent, invRepModel, custom, moment, CONSTANTS) {
    var invReportCollection = Parent.extend({

        model   : invRepModel,
        url     : 'journalEntries/getInventoryReport',
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var page;
            var startDate = moment(new Date());
            var endDate = moment(new Date());
            var dateRange; // = custom.retriveFromCash('inventoryReportDateRange') || {};

            this.filter = options.filter || custom.retriveFromCash('inventoryReport.filter');

            startDate.month(startDate.month() - 1);
            startDate.date(1);
            endDate.month(startDate.month());
            endDate.endOf('month');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : [];

            /*this.startDate = dateRange.startDate || new Date(startDate);
            this.endDate = dateRange.endDate || new Date(endDate);*/

            this.startDate = dateRange[0] || new Date(startDate);
            this.endDate = dateRange[1] || new Date(endDate);

            // options.startDate = this.startDate;
            // options.endDate = this.endDate;
            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            /*custom.cacheToApp('inventoryReportDateRange', {
                startDate: this.startDate,
                endDate  : this.endDate
            });*/

            custom.cacheToApp('inventoryReport.filter', options.filter);

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        showMore: function (options) {
            var that = this;
            var filterObject = options || {};
            // var dateRange = custom.retriveFromCash('inventoryReportDateRange') || {};
            var filter = options.filter || custom.retriveFromCash('inventoryReport.filter');
            var dateRange = filter && filter.date ? filter.date.value : [];
            var startDate = moment(new Date());
            var endDate = moment(new Date());

            startDate.month(startDate.month() - 1);
            startDate.date(1);
            endDate.month(startDate.month());
            endDate.endOf('month');

            /*filterObject.startDate = dateRange.startDate || new Date(startDate);
            filterObject.endDate = dateRange.endDate || new Date(endDate);*/

            filterObject.startDate = dateRange[0] || new Date(startDate);
            filterObject.endDate = dateRange[1] || new Date(endDate);

            filterObject.page = (options && options.page) ? options.page : this.page;
            filterObject.count = (options && options.count) ? options.count : this.namberToShow;
            filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;

            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },
                error  : function () {
                    App.render({
                        type   : 'error',
                        message: "Some Error."
                    });
                }
            });
        }
    });

    return invReportCollection;
});
