define([
    'Backbone',
    'Underscore',
    'models/DealTasksModel',
    'common',
    'collections/parent'
], function (Backbone, _, TaskModel, common, Parent) {
    'use strict';

    var TasksCollection = Parent.extend({
        model: TaskModel,

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
