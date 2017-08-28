define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/integrationUnlinkedProducts/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#unlinkedProductsTopBar',
        contentHeader: 'Unlinked Products',
        contentType  : CONSTANTS.RESOLVECONFLICTS,
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
