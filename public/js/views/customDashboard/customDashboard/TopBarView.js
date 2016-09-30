define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/customDashboard/customDashboard/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.CUSTOMDASHBOARDCHARDS,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
