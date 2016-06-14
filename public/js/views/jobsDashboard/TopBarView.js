define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/jobsDashboard/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';

    var TopBarView = BaseView.extend({
        el           : '#top-bar',
        contentType  : 'jobsDashboard',
        contentHeader: 'Jobs Dashboard',
        actionType   : null,
        template     : _.template(ContentTopBarTemplate)
    });
    return TopBarView;
});