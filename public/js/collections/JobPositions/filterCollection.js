define([
    'Backbone',
    'Underscore',
    'collections/parent',
    'models/JobPositionsModel',
    'common',
    'constants'
], function (Backbone, _, Parent, JobPositionsModel, common, CONSTANTS) {
    'use strict';

    var JobPositionsCollection = Parent.extend({
        model   : JobPositionsModel,
        url     : CONSTANTS.URLS.JOBPOSITIONS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,

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
        },

        parse: function (response) {
            if (response.data) {
                _.map(response.data, function (jopPosition) {
                    if (jopPosition.createdBy) {
                        jopPosition.createdBy.date = common.utcDateToLocaleDateTime(jopPosition.createdBy.date);
                    }
                    if (jopPosition.editedBy) {
                        jopPosition.editedBy.date = common.utcDateToLocaleDateTime(jopPosition.editedBy.date);
                    }
                    return jopPosition;
                });
            }

            return Parent.prototype.parse.apply(this, arguments);
        }
    });
    return JobPositionsCollection;
});
