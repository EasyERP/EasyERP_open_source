define([
    'Backbone',
    'collections/parent',
    'models/OpportunitiesModel',
    'constants'
], function (Backbone, Parent, OpportunityModel, CONSTANTS) {
    'use strict';

    var OpportunitiesCollection = Parent.extend({
        model      : OpportunityModel,
        url        : CONSTANTS.URLS.OPPORTUNITIES,
        contentType: null,
        initialize : function (options) {
            var page;

            options = options || {};

            this.startTime = new Date();
            this.contentType = options.contentType;
            this.parrentContentId = options.parrentContentId || null;

            page = options.page;

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }
    });
    return OpportunitiesCollection;
});
