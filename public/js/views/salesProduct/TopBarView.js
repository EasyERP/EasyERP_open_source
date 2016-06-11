define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Product/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SALESPRODUCT,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
