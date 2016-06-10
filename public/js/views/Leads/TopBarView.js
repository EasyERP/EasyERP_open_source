define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Leads/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.LEADS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
