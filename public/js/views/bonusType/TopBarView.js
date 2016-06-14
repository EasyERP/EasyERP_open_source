define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/bonusType/topBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.BONUSTYPE,
        contentHeader: 'BonusType',
        template     : _.template(ContentTopBarTemplate)
    });

    return topBarView;
});
