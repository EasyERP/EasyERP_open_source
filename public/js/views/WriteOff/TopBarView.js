define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/WriteOff/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.WRITEOFF,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
