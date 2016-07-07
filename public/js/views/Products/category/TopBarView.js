define([
    'Underscore',
    'views/topBarViewBase',
    'jQuery',
    'text!templates/Profiles/TopBarTemplate.html',
    'custom',
    'dataService',
    'common'
], function (_, BaseView, $, TopBarTemplate) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Products',
        actionType : null, // Content, Edit, Create
        template   : _.template(TopBarTemplate)

    });

    return TopBarView;
});
