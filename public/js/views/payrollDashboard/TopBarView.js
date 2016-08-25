define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/payrollDashboard/TopBarTemplate.html'
], function ($, _, BaseView, TopBarTemplate) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: 'Dashboard',
        actionType : null, // Content, Edit, Create
        template   : _.template(TopBarTemplate),

        events: {
            'click .backToSettings': 'backToSettingsEvent'
        },

        backToSettingsEvent: function (e) {
            e.stopPropagation();

            this.trigger('backToSettingsEvent');
        }
    });

    return TopBarView;
});
