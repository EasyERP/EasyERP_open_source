define([
    'Backbone',
    'collections/parent',
    'models/journalEntry',
    'helpers/getDateHelper',
    'custom',
    'constants'
], function (Backbone, Parent, JournalEntryModel, DateHelper, custom, CONSTANTS) {
    'use strict';
    var manualEntryCollection = Parent.extend({
        model   : JournalEntryModel,
        url     : CONSTANTS.URLS.JOURNAL_ENTRY,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var dateRange;
            var _opts;

            this.namberToShow = options.count;
            this.viewType = options.viewType;
            this.contentType = options.contentType;
            this.count = options.count;
            this.page = options.page || 1;

            this.filter = options.filter || custom.retriveFromCash('manualEntry.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

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

            _opts = options || {};
            _opts.error = _opts.error || _errHandler;

            this.startTime = new Date();

            if (this.page) {
                return this.getPage(this.page, _opts);
            }

            this.getFirstPage(_opts);
        }
    });

    return manualEntryCollection;
});
/**
 * Created by liliy on 05.09.2016.
 */
