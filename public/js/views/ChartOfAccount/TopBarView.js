define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/ChartOfAccount/TopBarTemplate.html',
    'custom',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.CHARTOFACCOUNT,
        template   : _.template(ContentTopBarTemplate)
    });
    return TopBarView;
});
