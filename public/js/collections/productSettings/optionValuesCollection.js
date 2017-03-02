define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/OptionsValuesModel',
    'common',
    'constants'
], function (Backbone, Parent, _, OptionsValuesModel, common, CONSTANTS) {
    'use strict';

    var OptionsValuesCollection = Parent.extend({
        model: OptionsValuesModel,
        url  : CONSTANTS.URLS.SETTINGS_PRODUCTS_VALUES,

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

            //this.getFirstPage(options);
        }
    });

    return OptionsValuesCollection;
});