define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Users/TopBarTemplate.html'
], function (_, BaseView, TopBarTemplate) {
    'use strict';
    var TopBarView = BaseView.extend({
        contentType     : 'Users',
        collectionLength: 0,
        template        : _.template(TopBarTemplate)
    });

    return TopBarView;
});
