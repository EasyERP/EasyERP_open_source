define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var relatedStatusModel = Backbone.Model.extend({
        idAttribute: '_id'
    });
    var relatedStatusesCollection = Backbone.Collection.extend({
        model     : relatedStatusModel,
        url       : function () {
            var mid = 39;
            var url = "workflows/relatedStatus?mid=" + mid;
            return url;
        },
        initialize: function () {
            this.fetch({
                type   : 'GET',
                reset  : true,
                success: this.fetchSuccess,
                error  : this.fetchError
            });
        },
        parse     : function (response) {
            return response.data;
        }
    });
    return relatedStatusesCollection;
});