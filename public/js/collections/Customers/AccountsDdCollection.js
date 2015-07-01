define(function () {
    var AccountModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var AccountsDdCollection = Backbone.Collection.extend({
        model: AccountModel,
        url: function () {
            var url = "/getPersonsForDd";
            return url;
        },

        initialize: function () {
            var mid = 39;

            this.fetch({
                data: $.param({
                    mid: mid
                }),
                type: 'GET',
                reset: true,
                success: this.fetchSuccess,
                error: this.fetchError
            });
        },

        parse: true,

        parse: function (response) {
            return response.data;
        }
    });

    return AccountsDdCollection;
});