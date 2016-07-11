define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Deals/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.DEALS,
        template   : _.template(ContentTopBarTemplate),
    });

    return TopBarView;
});
