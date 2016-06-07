define([
    'Backbone',
    'collections/parent',
    'models/MonthHoursModel',
    'constants'
], function (Backbone, Parent, MonthHoursModel, CONSTANTS) {
    'use strict';

    var MonthHoursCollection = Parent.extend({
        model   : MonthHoursModel,
        url     : CONSTANTS.URLS.MONTHHOURS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

        initialize: function (options) {
            var page;

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

    return MonthHoursCollection;
});
