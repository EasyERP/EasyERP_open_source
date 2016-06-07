define([
    'Backbone',
    'collections/parent',
    'models/HolidayModel',
    'constants'
], function (Backbone, Parent, HolidayModel, CONSTANTS) {
    'use strict';

    var HolidayCollection = Parent.extend({
        model   : HolidayModel,
        url     : CONSTANTS.URLS.HOLIDAY,
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
    return HolidayCollection;
});
