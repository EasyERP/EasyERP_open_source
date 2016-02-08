define([
    'Backbone',
    'jQuery',
    'constants'
], function (Backbone, $, CONSTANTS) {
    'use strict';

    var AccountModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var AccountsDdCollection = Backbone.Collection.extend({
        model: AccountModel,
        url  : function () {
            var url = CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD;
            return url;
        },

        initialize: function () {
            var mid = 39;

            this.fetch({
                data   : $.param({
                    mid: mid
                }),
                type   : 'GET',
                reset  : true,
                success: this.fetchSuccess,
                error  : this.fetchError
            });
        },

        parse: function (response) {
            return response.data;
        }
    });

    return AccountsDdCollection;
});