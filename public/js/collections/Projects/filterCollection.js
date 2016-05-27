define([
    'Backbone',
    'models/ProjectsModel',
    'constants'
], function (Backbone, ProjectModel, CONSTANTS) {
    'use strict';

    var ProjectsCollection = Backbone.Collection.extend({
        model       : ProjectModel,
        url         : CONSTANTS.URLS.PROJECTS,
        page        : null,
        namberToShow: null,
        viewType    : null,
        contentType : null,

        initialize: function (options) {
            var that = this;

            this.startTime = new Date();
            this.contentType = options.contentType;

            if (options && options.count) {
                this.namberToShow = options.count;
                this.count = options.count;
                this.page = options.page || 1;
            }
            
            this.fetch({
                data : options,
                reset: true,

                success: function () {
                    that.page++;
                },

                error: function (models, xhr) {
                    if (xhr.status === 401) {
                        Backbone.history.navigate('#login', {trigger: true});
                    }
                }
            });
        },

        showMore: function (options) {
            var that = this;

            options = options || {};

            if (options && options.page) {
                this.page = options.page;
            }
            if (options && options.count) {
                this.namberToShow = options.count;
            }

            options.page = this.page;
            options.count = this.namberToShow;
            options.filter = options.filter || {};

            this.fetch({
                data : options,
                waite: true,

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
        },

        parse: function (response) {
            return response.data;
        }
    });

    return ProjectsCollection;
});
