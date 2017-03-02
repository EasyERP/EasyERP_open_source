define([
    'Backbone',
    'models/ratesModel',
    'collections/parent',
    'helpers/getDateHelper',
    'constants',
    'moment'
], function (Backbone, PaymentModel, Parent, DateHelper, CONSTANTS, moment) {
    var Collection = Parent.extend({
        model: PaymentModel,
        url  : CONSTANTS.URLS.RATES,

        initialize: function (options) {
            var page;
            var dateRange;

            function _errorHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            page = options.page;
            options.error = options.error || _errorHandler;

            dateRange = DateHelper.getDate('thisMonth');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            this.contentType = options.contentType;

            this.startTime = new Date();

            if (options.url) {
                this.url = options.url;
            }

            options.reset = true;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return Collection;
});
