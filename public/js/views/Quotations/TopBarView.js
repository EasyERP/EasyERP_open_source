define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Quotations/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.QUOTATIONS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
