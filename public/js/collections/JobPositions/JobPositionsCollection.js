define([
    'Backbone',
    'jQuery',
    'models/JobPositionsModel',
    'constants'

], function (Backbone, $, JobPositionsModel, CONSTANTS) {
    'use strict';

    var JobPositionsCollection = Backbone.View.extend({
        model: JobPositionsModel,
        url  : function () {
            return CONSTANTS.URLS.JOBPOSITIONS;
        },

        initialize: function () {
            var mid = 39;

            this.fetch({
                data: $.param({
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
    return JobPositionsCollection;
});
