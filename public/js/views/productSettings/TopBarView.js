define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/productSettings/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.PRODUCTS_SETTINGS,
        contentHeader: 'Product Options',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
