define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Attendance/TopBarTemplate.html',
    'constants'
], function (_, BaseView, ContentTopBarTemplate, CONSTANTS) {
    'use strict';

    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.ATTENDANCE,
        template   : _.template(ContentTopBarTemplate)
    });

    return TopBarView;
});
