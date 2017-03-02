/**
 * Created by liliy on 02.03.2016.
 */
'use strict';
define([
    'Backbone',
    'models/hiredFired',
    'helpers/getDateHelper',
    'custom',
    'moment'
], function (Backbone, journalEntryModel, DateHelper, Custom) {
    var TrialBalanceCollection = Backbone.Collection.extend({

        model       : journalEntryModel,
        url         : 'journalEntries/getTrialBalance',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            var _opts;
            var dateRange;

            this.filter = options.filter || Custom.retriveFromCash('trialBalance.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp('trialBalance.filter', options.filter);

            this.page = options.page;

            _opts = options || {};

            this.startTime = new Date();

            this.fetch({
                data   : _opts,
                reset  : true,
                success: function () {
                },

                error: function (err, xhr) {
                    console.log(xhr);
                }
            });
        },

        showMore: function (options) {
            var that = this;

            this.fetch({
                data   : options,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Some Error.'
                    });
                }
            });
        }
    });

    return TrialBalanceCollection;
});
