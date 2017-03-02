define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/ChartOfAccount/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.CHARTOFACCOUNT,
        contentHeader: 'Chart Of Accounts',
        template     : _.template(ContentTopBarTemplate)
    });
    return TopBarView;
});
