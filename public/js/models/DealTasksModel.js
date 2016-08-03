define([
    'Backbone',
    'Underscore',
    'common',
    'Validation',
    'constants'
], function (Backbone, _, common, Validation, CONSTANTS) {
    'use strict';

    var TaskModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }
            });
        },

        /*parse: function (response) {
            if (response && response.attachments) {
                _.map(response.attachments, function (attachment) {
                    attachment.uploadDate = common.utcDateToLocaleDate(attachment.uploadDate);
                    return attachment;
                });
            }
            if (response && response.notes) {
                _.map(response.notes, function (notes) {
                    notes.date = common.utcDateToLocaleDate(notes.date);
                    return notes;
                });
            }
            return response;
        },*/

        validate: function (attrs) {
            var errors = [];

            Validation.checkGroupsNameField(errors, true, attrs.assignedTo._id || attrs.assignedTo, 'AssignedTo');
            Validation.checkDateField(errors, true, attrs.dueDate, 'Due Date');

            if (errors.length > 0) {
                return errors;
            }
        },

        urlRoot: function () {
            return CONSTANTS.URLS.DEALTASKS;
        }
    });
    return TaskModel;
});
