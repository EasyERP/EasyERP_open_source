define([
    'Backbone',
    'collections/parent',
    'models/hiredFired',
    'dataService',
    'constants'
], function (Backbone, Parent, Model, dataService, CONSTANTS) {
    'use strict';

    var EmployeesCollection = Parent.extend({
        model   : Model,
        url     : CONSTANTS.URLS.PROJECTSDASHBOARD,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

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

    return EmployeesCollection;
});
