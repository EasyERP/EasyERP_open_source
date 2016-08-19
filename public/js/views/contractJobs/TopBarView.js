define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/contractJobs/TopBarTemplate.html'
], function (_, BaseView, ContentTopBarTemplate) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'contractJobs',
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
