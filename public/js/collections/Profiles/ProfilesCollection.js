define([
    'Backbone',
    'jQuery',
    'collections/parent',
    'models/ProfilesModel',
    'constants'
], function (Backbone, $, Parent, ProfilesModel, CONSTANTS) {
    'use strict';

    var ProfilesCollection = Parent.extend({
        model: ProfilesModel,
        url  : function () {
            return CONSTANTS.URLS.PROFILES;
        },

        initialize: function () {
            var mid = 39;

            this.startTime = new Date();
            this.fetch({
                data: $.param({
                    mid: mid
                }),

                // maybe not used query mid
                reset  : true,
                success: this.fetchSuccess,
                error  : function (models, xhr) {
                    if ((xhr.status === 401) || (xhr.status === 403)) {
                        Backbone.history.navigate('#login');
                    }
                }
            });
        }
    });

    return ProfilesCollection;
});
