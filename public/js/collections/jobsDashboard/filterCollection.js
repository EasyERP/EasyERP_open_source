define([
    'Backbone',
    'models/jobsModel',
    'collections/parent',
    'constants'
], function (Backbone, JobsModel, Parent, CONSTANTS) {
    'use strict';

    var JobsCollection = Parent.extend({
        model       : JobsModel,
        url         : CONSTANTS.URLS.JOBS,
        contentType : null,
        page        : null,
        numberToShow: null,
        viewType    : 'list',

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

    return JobsCollection;
});
