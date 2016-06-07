define([
    'Backbone',
    'collections/parent',
    'models/journalEntry',
    'custom',
    'moment',
    'constants'
], function (Backbone, Parent, JournalEntryModel, custom, moment, CONSTANTS) {
    'use strict';
    var JournalEntryCollection = Parent.extend({
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
            this.filter = options.filter || custom.retriveFromCash('journalEntry.filter');

            startDate.month(startDate.month() - 1);
            startDate.date(1);
            endDate.month(startDate.month());
            endDate.endOf('month');

            dateRange = custom.retriveFromCash('journalEntryDateRange') || {};
            this.startDate = dateRange.startDate;
            this.endDate = dateRange.endDate;

            this.startDate = dateRange.startDate || new Date(startDate);
            this.endDate = dateRange.endDate || new Date(endDate);

            options.startDate = this.startDate;
            options.endDate = this.endDate;
            options.filter = this.filter;

            custom.cacheToApp('journalEntryDateRange', {
                startDate: this.startDate,
                endDate  : this.endDate
            });

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

    return JournalEntryCollection;
});
