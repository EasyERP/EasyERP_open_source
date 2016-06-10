define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Quotation/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.QUOTATION,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
