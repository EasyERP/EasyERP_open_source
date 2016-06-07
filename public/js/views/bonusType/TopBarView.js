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
        viewType     : null,
        template     : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }
            this.render();
        }
    });

    return topBarView;
});