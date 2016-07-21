define([
    'Backbone',
    'models/DealTasksModel',
    'constants',
    'collections/parent',
     'common'
], function (Backbone, TaskModel, CONSTANTS, Parent, common) {
    'use strict';

    var TasksCollection = Parent.extend({
        model       : TaskModel,
        url         : CONSTANTS.URLS.DEALTASKS,
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
        },

        parse: function (response) {
            if (response.data) {
                _.map(response.data, function (task) {
                    if (task.dueDate) {
                        task.dueDate = common.utcDateToLocaleDate(task.dueDate);
                    }
                    if (task && task.attachments) {
                        _.map(task.attachments, function (attachment) {
                            attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                            return attachment;
                        });
                    }
                    if (task && task.notes) {
                        _.map(task.notes, function (notes) {
                            notes.date = common.utcDateToLocaleDate(notes.date);
                            return notes;
                        });
                    }
                    return task;
                });
            }

            return Parent.prototype.parse.call(this, response);
        }
    });

    return TasksCollection;
});
