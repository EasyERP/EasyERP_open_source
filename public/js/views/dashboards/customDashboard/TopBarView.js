define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/dashboards/customDashboard/TopBarTemplate.html',
    'constants'
], function ($, _, TopBarBase, ContentTopBarTemplate, CONSTANTS) {
    var TopBarView = TopBarBase.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.CUSTOMDASHBOARDCHARDS,
        template   : _.template(ContentTopBarTemplate),
        events : {
            'click #top-bar-cancelBtn': 'cancelChanges'
        },

        cancelChanges: function () {
            this.trigger('cancelChanges');
        }

    });

    return TopBarView;
});
