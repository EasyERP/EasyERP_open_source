define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/importHistoryModel',
    'common',
    'constants'
], function (Backbone, Parent, _, ImportHistoryModel, common, CONSTANTS) {
    'use strict';

    var ImportHistoryCollection = Parent.extend({
        model   : ImportHistoryModel,
        url     : CONSTANTS.URLS.IMPORT_HISTORY,

        initialize: function (options) {
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;

            this.startTime = new Date();

            this.getFirstPage(options);
        }
    });

    return ImportHistoryCollection;
});