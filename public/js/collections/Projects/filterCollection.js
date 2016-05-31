define([
    'Backbone',
    'collections/parent',
    'models/ProjectsModel',
    'constants'
], function (Backbone, Parent, ProjectModel, CONSTANTS) {
    'use strict';

    var ProjectsCollection = Parent.extend({
        model   : ProjectModel,
        url     : CONSTANTS.URLS.PROJECTS,
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

    return ProjectsCollection;
});
