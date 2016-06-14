define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Birthdays/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';

    var TopBarView = BaseView.extend({
        el      : '#top-bar',
        template: _.template(ContentTopBarTemplate)
    });
    return TopBarView;
});
