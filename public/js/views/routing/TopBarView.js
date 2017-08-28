define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/routing/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.ROUTING,

        template: _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
