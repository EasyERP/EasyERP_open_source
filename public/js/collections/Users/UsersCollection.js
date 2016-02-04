define([
        "models/UsersModel"
    ],
    function (UserModel) {
        var UsersCollection = Backbone.Collection.extend({
            model     : UserModel,
            url       : function () {
                return "/users";
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