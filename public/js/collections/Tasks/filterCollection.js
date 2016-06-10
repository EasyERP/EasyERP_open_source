define([
    'Backbone',
    'models/TasksModel',
    'constants',
    'collections/parent'
], function (Backbone, TaskModel, CONSTANTS, Parent) {
    'use strict';

    var TasksCollection = Parent.extend({
        model       : TaskModel,
        url         : CONSTANTS.URLS.TASKS,
        page        : null,
        namberToShow: null,
        viewType    : null,

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

            this.parrentContentId = options.parrentContentId || null;
            this.viewType = options.viewType;
            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }

        /* showMore: function (options) {
            var that = this;
            var filterObject = {};
            if (options) {
                for (var i in options) {
                    filterObject[i] = options[i];
                }
            }
            if (options && options.page) {
                this.page = options.page;
            }
            if (options && options.count) {
                this.namberToShow = options.count;
            }
            filterObject.page = this.page;
            filterObject.count = this.namberToShow;
            filterObject.filter = (options) ? options.filter : {};
            filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
            this.fetch({
                data   : filterObject,
                waite  : true,
                success: function (models) {
                    that.page += 1;
                    that.trigger('showmore', models);
                },
                error  : function () {
                    App.render({
                        type   : 'error',
                        message: "Some Error."
                    });
                }
            });
        }*/
    });

    return TasksCollection;
});
