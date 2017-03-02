define([
    'Backbone',
    'collections/parent',
    'models/invReportModel',
    'helpers/getDateHelper',
    'custom',
    'moment',
    'constants'
], function (Backbone, Parent, invRepModel, DateHelper, custom, moment, CONSTANTS) {
    var invReportCollection = Parent.extend({

        model   : invRepModel,
        url     : 'journalEntries/getInventoryReport',
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var dateRange;
            var _opts;

            this.filter = options.filter || custom.retriveFromCash('inventoryReport.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            custom.cacheToApp('inventoryReport.filter', options.filter);

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            this.page = options.page;

            _opts = options || {};
            _opts.error = _opts.error || _errHandler;

            this.startTime = new Date();

            if (this.page) {
                return this.getPage(this.page, _opts);
            }

            this.getFirstPage(_opts);
        }
    });

    return invReportCollection;
});
