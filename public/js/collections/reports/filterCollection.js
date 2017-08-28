define([
    'Backbone',
    'collections/parent',
    'models/CustomReportsModel',
    'constants'
], function (Backbone, Parent, Model, CONSTANTS) {
    'use strict';

    var CustomReportsCollection = Parent.extend({
        model   : Model,
        url     : CONSTANTS.URLS.REPORTS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

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

    return CustomReportsCollection;
});