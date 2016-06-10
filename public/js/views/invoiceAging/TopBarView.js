define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/invoiceAging/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.INVOICEAGING,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
