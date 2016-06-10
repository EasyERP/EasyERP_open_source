define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Order/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.ORDER,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
