define([
    'Backbone',
    'Underscore',
    'constants'
], function (Backbone, _, CONSTANTS) {
    'use strict';

    var ImportHistoryModel = Backbone.Model.extend({
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

        defaults: {
            date: '',
            fileName: '',
            user: '',
            status: '',
            filePath: ''
        },

        urlRoot: function () {
            return CONSTANTS.URLS.IMPORT_HISTORY;
        }
    });
    return ImportHistoryModel;
});
