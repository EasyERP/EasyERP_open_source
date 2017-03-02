define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/stockInventory/topBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.STOCKINVENTORY,
        contentHeader: 'Stock Detail',
        template     : _.template(ContentTopBarTemplate)
    });

    return topBarView;
});
