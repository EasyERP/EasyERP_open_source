define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/productType/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.PRODUCTTYPE,
        contentHeader: 'Product Types',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
