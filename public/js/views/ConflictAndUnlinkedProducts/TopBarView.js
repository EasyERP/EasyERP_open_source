define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/ConflictAndUnlinkedProducts/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#top-bar',
        contentHeader: 'Resolve Conflicts and Unlinked Products',
        template     : _.template(ContentTopBarTemplate)
    });

    return topBarView;
});
