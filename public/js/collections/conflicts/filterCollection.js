define([
    'Underscore',
    'Backbone',
    'collections/parent',
    'models/conflictModel',
    'common',
    'constants'
], function (_, Backbone, ParentCollection, ConflictModel, common, CONSTANTS) {
    'use strict';

    var ConflictFilterCollection = ParentCollection.extend({

        model: ConflictModel,
        url  : CONSTANTS.URLS.CONFLICT,

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

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }

    });

    return ConflictFilterCollection;

});
