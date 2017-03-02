define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/priceLists/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el           : '#top-bar',
        contentType  : CONSTANTS.PRICELISTS,
        contentHeader: 'Price Lists',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
