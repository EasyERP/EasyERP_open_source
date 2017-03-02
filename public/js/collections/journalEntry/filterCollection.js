define([
    'Backbone',
    'collections/parent',
    'models/journalEntry',
    'helpers/getDateHelper',
    'custom',
    'constants'
], function (Backbone, Parent, JournalEntryModel, DateHelper, custom, CONSTANTS) {
    'use strict';
    var JournalEntryCollection = Parent.extend({
        model   : JournalEntryModel,
        url     : CONSTANTS.URLS.JOURNAL_ENTRY,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var _opts;
            var dateRange;

            this.filter = options.filter || custom.retriveFromCash('journalEntry.filter');

            this.namberToShow = options.count;
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            this.count = options.count;
            this.page = options.page || 1;

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;
            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                key  : 'date',
                value: [this.startDate, this.endDate]
            };

            custom.cacheToApp('journalEntry.filter', options.filter);

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            _opts = options || {};
            _opts.error = _opts.error || _errHandler;

            this.startTime = new Date();

            if (this.page) {
                return this.getPage(this.page, _opts);
            }

            this.getFirstPage(_opts);
        }
    });

    return JournalEntryCollection;
});
