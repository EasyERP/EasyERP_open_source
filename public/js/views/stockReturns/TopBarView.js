define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/stockReturns/TopBarTemplate.html',
    'custom',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.STOCKRETURNS,
        contentHeader: 'stockReturns',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
