define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/stockTransactions/topBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.STOCKTRANSACTIONS,
        contentHeader: 'Transfers',
        template     : _.template(ContentTopBarTemplate)
    });

    return topBarView;
});
