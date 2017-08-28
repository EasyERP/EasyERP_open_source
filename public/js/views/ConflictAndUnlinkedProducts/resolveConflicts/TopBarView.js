define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/resolveConflicts/topBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var topBarView = BaseView.extend({
        el           : '#resolveConflictsTopBar',
        contentHeader: 'Resolve Conflicts',
        template     : _.template(ContentTopBarTemplate),
        contentType  : CONSTANTS.INTEGRATIONUNLINKEDPRODUCTS
    });

    return topBarView;
});
