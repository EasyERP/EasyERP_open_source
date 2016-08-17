define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Products/TopBarTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'custom',
    'common',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, importTemplate, attachView, Custom, Common, CONSTANTS) {
    var TopBarView = BaseView.extend({
        el            : '#top-bar',
        contentType   : CONSTANTS.PRODUCTS,
        actionType    : null, // Content, Edit, Create
        template      : _.template(ContentTopBarTemplate),
        importTemplate: _.template(importTemplate)

    });

    return TopBarView;
});
