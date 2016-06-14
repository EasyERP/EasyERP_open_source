define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Applications/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Applications',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
