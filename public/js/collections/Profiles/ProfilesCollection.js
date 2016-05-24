define([
        'Backbone',
        'jQuery',
        "models/ProfilesModel",
        'constants'
    ],
    function (Backbone, $, ProfilesModel, CONSTANTS) {
        'use strict';

        var ProfilesCollection = Backbone.Collection.extend({
            model     : ProfilesModel,
            url       : function () {
                return CONSTANTS.URLS.PROFILES;
            },
            initialize: function () {
                this.startTime = new Date();
                var mid = 39;
                this.fetch({
                    data   : $.param({
                        mid: mid
                    }),  // maybe not used query mid
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : function (models, xhr) {
                        if ((xhr.status === 401) || (xhr.status === 403)) {
                            Backbone.history.navigate('#login');
                        }
                    }
                });
            },
            parse     : function (response) {
                return response.data;
            }
        });
        return ProfilesCollection;
    });
