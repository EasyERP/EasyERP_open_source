define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Persons/TopBarTemplate.html',
    'text!templates/Notes/importTemplate.html'
], function (_, BaseView, ContentTopBarTemplate, importTemplate) {
    'use strict';
    var TopBarView = BaseView.extend({
        el            : '#top-bar',
        contentType   : 'Persons',
        template      : _.template(ContentTopBarTemplate),
        importTemplate: _.template(importTemplate)
    });

    return TopBarView;
});
