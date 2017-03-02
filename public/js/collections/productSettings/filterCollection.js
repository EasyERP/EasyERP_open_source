define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/OptionsModel',
    'common',
    'constants'
], function (Backbone, Parent, _, OptionsModel, common, CONSTANTS) {
    'use strict';

    var OptionsCollection = Parent.extend({
        model: OptionsModel,
        url  : CONSTANTS.URLS.SETTINGS_PRODUCTS_OPTION,

        initialize: function (options) {
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;

            options.reset = true;

            this.startTime = new Date();

            this.getFirstPage(options);
        }
    });

    return OptionsCollection;
});