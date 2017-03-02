define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/purchaseOrders/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.PURCHASEORDERS,
        contentHeader: 'Orders',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
