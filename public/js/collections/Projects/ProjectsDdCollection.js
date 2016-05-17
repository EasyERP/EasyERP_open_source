define([
    'Backbone'
], function (Backbone) {
    'use strict';

    var ProjectModelDd = Backbone.Model.extend({
        idAttribute: "_id"
    });
    var ProjectsDdCollection = Backbone.Collection.extend({
        model: ProjectModelDd,
        url  : function () {
            var mid = 39;
            return "/getProjectsForDd?mid=" + mid;
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
    return ProjectsDdCollection;
});