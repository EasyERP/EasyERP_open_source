/**
 * Created by liliy on 18.03.2016.
 */
'use strict';
define([
    'Backbone',
    'models/journalEntry',
    'helpers/getDateHelper',
    'custom'
], function (Backbone, journalEntryModel, DateHelper, Custom) {
    var ProfitAndLossCollection = Backbone.Collection.extend({

        model       : journalEntryModel,
        url         : 'journalEntries/getProfitAndLoss',
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

        initialize: function (options) {
            var dateRange;
            var _opts;

            this.filter = options.filter || Custom.retriveFromCash('profitAndLoss.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp('profitAndLoss.filter', options.filter);

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
            var filterObject = options || {};

            filterObject.filter = options ? options.filter : {};

            this.fetch({
                data   : filterObject,
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

    return ProfitAndLossCollection;
});
