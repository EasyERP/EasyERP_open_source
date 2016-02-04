define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Profiles/TopBarTemplate.html',
    'dataService'
], function ($, _, BaseView, TopBarTemplate, dataService) {
    'use strict';
    return BaseView.extend({
        contentType: "Profiles",
        template   : _.template(TopBarTemplate),

        onDeleteEvent: function (event) {
            event.preventDefault();

            var self = this;
            var selectedProfileId = $('#profilesList > li.active > a').data('id');

            if (selectedProfileId === "1387275598000" || selectedProfileId === "1387275504000") {
                App.render({
                    type   : 'error',
                    message: "You cannot delete this profile"
                });

                return;
            }
            dataService.getData('/users/profiles/' + selectedProfileId, null, function (res) {
                if (res.count === 0) {
                    if (confirm('Delete profile?')) {
                        self.trigger('deleteEvent');
                    }
                } else {
                    if (confirm('Delete profile? Users ' + res.data.join(', ') + ' will be assigned to banned profile!')) {
                        self.trigger('deleteEvent');

                        if (res.isOwnProfile) {
                            window.location = "/logout";
                        }
                    }
                }
            });

        }
    });
});
