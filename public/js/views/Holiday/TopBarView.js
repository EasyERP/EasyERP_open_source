define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Holiday/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.HOLIDAY,
        contentHeader: 'Holidays',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
