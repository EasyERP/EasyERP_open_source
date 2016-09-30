define([
    'Backbone',
    'collections/parent',
    'models/journalEntry',
    'custom',
    'moment',
    'constants'
], function (Backbone, Parent, JournalEntryModel, custom, moment, CONSTANTS) {
    'use strict';
    var manualEntryCollection = Parent.extend({
        model   : JournalEntryModel,
        url     : CONSTANTS.URLS.JOURNAL_ENTRY,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var dateRange;
            var page;
            var startDate = moment(new Date());
            var endDate = moment(new Date());

            this.namberToShow = options.count;
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            this.count = options.count;
            this.page = options.page || 1;
            this.filter = options.filter || custom.retriveFromCash('manualEntry.filter');

            startDate.month(startDate.month() - 1);
            startDate.date(1);
            endDate.month(startDate.month());
            endDate.endOf('month');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : [];

            this.startDate = dateRange[0] || new Date(startDate);
            this.endDate = dateRange[1] || new Date(endDate);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            options.filter._type = {
                value: ['manualEntry'],
                type : 'string'
            };

            custom.cacheToApp('manualEntry.filter', options.filter);

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
        }
    });

    return manualEntryCollection;
});
/**
 * Created by liliy on 05.09.2016.
 */
