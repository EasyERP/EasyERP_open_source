define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/integrationUnlinkedProducts/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentHeader: 'Unlinked Products',
        contentType  : CONSTANTS.INTEGRATIONUNLINKEDPRODUCTS,
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
