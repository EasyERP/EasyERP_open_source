define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/settingsOverview/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.SETTINGSOVERVIEW,
        contentHeader: 'Settings Overview',
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render(options);
        }
    });

    return TopBarView;
});
