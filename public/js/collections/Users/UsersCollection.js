define([
    'Backbone',
    'jQuery',
    "models/UsersModel",
    'constants'
], function (Backbone, $, UserModel, CONSTANTS) {
    'use strict';
    var UsersCollection = Backbone.Collection.extend({
        model     : UserModel,
        url       : function () {
            return CONSTANTS.URLS.USERS;
        },
        initialize: function () {
            var mid = 39;
            this.fetch({
                data   : $.param({
                    mid: mid
                }),
                reset  : true,
                success: this.fetchSuccess,
                error  : this.fetchError
            });
        },
        parse     : function (response) {
            return response.data;
        }
    });
    return UsersCollection;
});