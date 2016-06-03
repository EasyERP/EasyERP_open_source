define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Projects/TopBarTemplate.html',
    'custom',
    'common'
], function (_, BaseView, ContentTopBarTemplate, Custom, common) {
    var TopBarView = BaseView.extend({
        contentType: 'Projects',
        actionType : null, // Content, Edit, Create
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
