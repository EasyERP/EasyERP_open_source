define([
    'Underscore',
    'views/topBarViewBase',
    'jQuery',
    'text!templates/ProductCategory/TopBarTemplate.html'
], function (_, BaseView, $, TopBarTemplate) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Products',
        actionType : null, // Content, Edit, Create
        template   : _.template(TopBarTemplate)
    });

    return TopBarView;
});
