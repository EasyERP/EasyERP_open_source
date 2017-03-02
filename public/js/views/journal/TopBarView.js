define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/journal/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.JOURNAL,
        contentHeader: 'Journal',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
