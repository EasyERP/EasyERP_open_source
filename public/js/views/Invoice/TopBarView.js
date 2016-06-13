define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Invoice/TopBarTemplate.html',
    'custom',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.INVOICE,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
