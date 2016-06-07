define([
    'views/topBarViewBase',
    'text!templates/Vacation/TopBarTemplate.html',
    'custom',
    'common',
    'constants'
], function (BaseView, ContentTopBarTemplate, Custom, Common, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.VACATION,
        template   : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }
            this.render();
        }
    });

    return TopBarView;
});
