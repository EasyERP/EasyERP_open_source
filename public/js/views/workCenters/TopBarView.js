define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/workCenters/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.WORKCENTERS,

        template: _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
