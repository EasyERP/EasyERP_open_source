define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Tasks/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Tasks',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
