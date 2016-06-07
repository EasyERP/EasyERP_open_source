define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Projects/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    var TopBarView = BaseView.extend({
        contentType: 'Projects',
        actionType : null, // Content, Edit, Create
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
