define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/DealTasks/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : 'DealTasks',
        contentHeader: 'Tasks',
        template     : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
