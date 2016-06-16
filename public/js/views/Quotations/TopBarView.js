define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Quotations/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.QUOTATIONS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
